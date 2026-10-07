package com.Payment.recovery;

import com.Payment.entity.Payment;
import com.Payment.entity.PaymentStatus;
import com.Payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentRecoveryScheduler {

    private final PaymentRepository repository;

    private static final int MAX_RETRY_COUNT = 5;
    private static final int PENDING_EXPIRY_MINUTES = 5;

    @Scheduled(fixedDelay = 30000)
    public void recoverPendingPayments() {
        List<Payment> pending = repository.findByStatus(PaymentStatus.PENDING);

        if (pending.isEmpty()) {
            return;
        }

        log.debug("PaymentRecoveryScheduler: checking {} pending payment(s) for self-healing", pending.size());
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(PENDING_EXPIRY_MINUTES);

        for (Payment payment : pending) {
            // Only process payments that have stayed in PENDING past the safety threshold
            if (payment.getCreatedAt() != null && payment.getCreatedAt().isAfter(threshold)) {
                continue;
            }

            Integer retries = payment.getRetryCount();
            if (retries == null) {
                retries = 0;
            }

            if (retries >= MAX_RETRY_COUNT) {
                payment.setStatus(PaymentStatus.FAILED);
                payment.setFailureReason("Self-healing: Payment timed out after exceeding retry limit of " + MAX_RETRY_COUNT);
                repository.save(payment);
                log.warn("[SELF-HEALING] Pending payment expired and marked FAILED: paymentId={}, orderId={}",
                        payment.getId(), payment.getOrderId());
                continue;
            }

            payment.setRetryCount(retries + 1);
            repository.save(payment);
            log.info("[SELF-HEALING] Re-checked pending payment: paymentId={}, retryAttempt={}/{}",
                    payment.getId(), retries + 1, MAX_RETRY_COUNT);
        }
    }
}