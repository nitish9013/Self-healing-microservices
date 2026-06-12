package com.Payment.recovery;

import com.Payment.entity.Payment;
import com.Payment.entity.PaymentStatus;
import com.Payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PaymentRecoveryScheduler {

    private final PaymentRepository repository;

    @Scheduled(fixedDelay = 30000)
    public void recoverPendingPayments() {

        List<Payment> pending =
                repository.findByStatus(
                        PaymentStatus.PENDING
                );

        for(Payment payment : pending) {

            Integer retries =
                    payment.getRetryCount();

            if(retries == null) {
                retries = 0;
            }

            if(retries >= 5) {

                payment.setStatus(
                        PaymentStatus.FAILED
                );

                repository.save(payment);

                continue;
            }

            payment.setRetryCount(
                    retries + 1
            );

            repository.save(payment);
        }
    }
}