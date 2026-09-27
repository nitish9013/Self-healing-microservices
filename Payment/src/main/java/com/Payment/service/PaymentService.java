package com.Payment.service;

import com.Payment.event.PaymentCompletedEvent;
import com.Payment.kafka.PaymentEventProducer;
import com.Payment.dto.*;
import com.Payment.entity.Payment;
import com.Payment.entity.PaymentStatus;
import com.Payment.event.PaymentEventService;
import com.Payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.Payment.dto.PaymentHistoryResponse;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentEventService eventService;
    private final PaymentRepository paymentRepository;
    private final RazorpayService razorpayService;
    private final PaymentEventProducer paymentEventProducer;

    private PaymentHistoryResponse toPaymentHistoryResponse(
            Payment payment
    ) {

        return PaymentHistoryResponse.builder()
                .provider(payment.getProvider())
                .paymentId(payment.getId().toString())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .transactionId(payment.getTransactionId())
                .status(payment.getStatus().name())
                .createdAt(payment.getCreatedAt())
                .completedAt(payment.getCompletedAt())
                .build();
    }

    public Payment getPayment(
            String paymentId
    ) {

        log.debug(
                "Fetching payment: paymentId={}",
                paymentId
        );

        return paymentRepository.findById(
                        UUID.fromString(paymentId)
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Payment not found"
                        )
                );
    }

    public PaymentResponse createPayment(
            PaymentRequest request
    ) throws Exception {

        log.info(
                "Payment creation started: orderId={}, amount={}, currency={}",
                request.getOrderId(),
                request.getAmount(),
                request.getCurrency()
        );

        try {

            if (request.getOrderId() == null
                    || request.getOrderId().isBlank()) {

                log.warn("Payment creation rejected: missing orderId");

                throw new IllegalArgumentException(
                        "Order ID is required"
                );
            }

            if (request.getAmount() == null
                    || request.getAmount() <= 0) {

                log.warn(
                        "Payment creation rejected: invalid payment amount"
                );

                throw new IllegalArgumentException(
                        "Payment amount must be greater than zero"
                );
            }

            if (request.getIdempotencyKey() == null
                    || request.getIdempotencyKey().isBlank()) {

                log.warn(
                        "Payment creation rejected: missing idempotency key"
                );

                throw new IllegalArgumentException(
                        "Idempotency key is required"
                );
            }

            Optional<Payment> existingByKey =
                    paymentRepository.findByIdempotencyKey(
                            request.getIdempotencyKey()
                    );

            if (existingByKey.isPresent()) {

                Payment existing =
                        existingByKey.get();

                log.info(
                        "Duplicate payment request detected. Returning existing payment: paymentId={}, orderId={}",
                        existing.getId(),
                        existing.getOrderId()
                );

                return PaymentResponse.builder()
                        .paymentId(existing.getId().toString())
                        .orderId(existing.getOrderId())
                        .razorpayOrderId(
                                existing.getRazorpayOrderId()
                        )
                        .amount(existing.getAmount())
                        .currency(existing.getCurrency())
                        .status(existing.getStatus().name())
                        .message("Payment already created")
                        .build();
            }

            if (paymentRepository
                    .findByOrderId(request.getOrderId())
                    .isPresent()) {

                log.warn(
                        "Payment creation rejected: payment already exists for orderId={}",
                        request.getOrderId()
                );

                throw new IllegalStateException(
                        "Payment already exists for order"
                );
            }

            log.info(
                    "Creating Razorpay order: orderId={}, amount={}",
                    request.getOrderId(),
                    request.getAmount()
            );

            var razorpayOrder =
                    razorpayService.createOrder(
                            request.getAmount(),
                            request.getCurrency()
                    );

            Payment payment =
                    Payment.builder()
                            .orderId(request.getOrderId())
                            .userId(request.getUserId())
                            .amount(request.getAmount())
                            .currency(
                                    request.getCurrency() == null
                                            || request.getCurrency().isBlank()
                                            ? "INR"
                                            : request.getCurrency().toUpperCase()
                            )
                            .idempotencyKey(
                                    request.getIdempotencyKey()
                            )
                            .provider("RAZORPAY")
                            .status(PaymentStatus.PENDING)
                            .razorpayOrderId(
                                    razorpayOrder.get("id")
                            )
                            .retryCount(0)
                            .build();

            payment =
                    paymentRepository.save(payment);

            eventService.saveEvent(
                    payment.getId(),
                    "PAYMENT_CREATED",
                    payment.getOrderId()
            );

            log.info(
                    "Payment created successfully: paymentId={}, orderId={}, status={}",
                    payment.getId(),
                    payment.getOrderId(),
                    payment.getStatus()
            );

            return PaymentResponse.builder()
                    .paymentId(
                            payment.getId().toString()
                    )
                    .orderId(
                            payment.getOrderId()
                    )
                    .razorpayOrderId(
                            payment.getRazorpayOrderId()
                    )
                    .amount(payment.getAmount())
                    .currency(payment.getCurrency())
                    .status(
                            payment.getStatus().name()
                    )
                    .message(
                            "Payment Created"
                    )
                    .build();

        } catch (Exception ex) {

            log.error(
                    "Payment creation failed: orderId={}, error={}",
                    request.getOrderId(),
                    ex.getMessage(),
                    ex
            );

            throw ex;
        }
    }

    public PaymentResponse verifyPayment(
            VerifyPaymentRequest request
    ) throws Exception {

        log.info(
                "Payment verification started: paymentId={}",
                request.getPaymentId()
        );

        try {

            if (request.getPaymentId() == null
                    || request.getRazorpayPaymentId() == null
                    || request.getRazorpaySignature() == null) {

                log.warn(
                        "Payment verification rejected: incomplete verification data"
                );

                throw new IllegalArgumentException(
                        "Payment verification data is incomplete"
                );
            }

            Payment payment =
                    paymentRepository.findById(
                                    UUID.fromString(
                                            request.getPaymentId()
                                    )
                            )
                            .orElseThrow(
                                    () -> new IllegalArgumentException(
                                            "Payment record not found"
                                    )
                            );

            String storedRazorpayOrderId =
                    payment.getRazorpayOrderId();

            if (!storedRazorpayOrderId.equals(
                    request.getRazorpayOrderId()
            )) {

                log.warn(
                        "Payment verification rejected: Razorpay order mismatch, paymentId={}",
                        request.getPaymentId()
                );

                throw new SecurityException(
                        "Razorpay order mismatch"
                );
            }

            if (payment.getStatus()
                    == PaymentStatus.SUCCESS) {

                log.info(
                        "Payment already verified: paymentId={}, orderId={}",
                        payment.getId(),
                        payment.getOrderId()
                );

                return PaymentResponse.builder()
                        .paymentId(
                                payment.getId().toString()
                        )
                        .orderId(
                                payment.getOrderId()
                        )
                        .razorpayOrderId(
                                payment.getRazorpayOrderId()
                        )
                        .status(
                                PaymentStatus.SUCCESS.name()
                        )
                        .message(
                                "Payment already verified"
                        )
                        .build();
            }

            Optional<Payment> existingPayment =
                    paymentRepository
                            .findByRazorpayPaymentId(
                                    request.getRazorpayPaymentId()
                            );

            if (existingPayment.isPresent()
                    && !existingPayment.get()
                    .getId()
                    .equals(payment.getId())) {

                log.warn(
                        "Payment verification rejected: Razorpay payment already associated with another payment record"
                );

                throw new SecurityException(
                        "Razorpay payment is already associated with another payment"
                );
            }

            boolean valid =
                    razorpayService.verifySignature(
                            storedRazorpayOrderId,
                            request.getRazorpayPaymentId(),
                            request.getRazorpaySignature()
                    );

            if (!valid) {

                log.warn(
                        "Payment signature verification failed: paymentId={}, orderId={}",
                        payment.getId(),
                        payment.getOrderId()
                );

                payment.setStatus(
                        PaymentStatus.FAILED
                );

                payment.setFailureReason(
                        "Invalid Razorpay payment signature"
                );

                paymentRepository.save(payment);

                eventService.saveEvent(
                        payment.getId(),
                        "PAYMENT_VERIFICATION_FAILED",
                        request.getRazorpayPaymentId()
                );

                throw new SecurityException(
                        "Invalid Razorpay payment signature"
                );
            }

            log.debug(
                    "Payment signature verified successfully: paymentId={}",
                    payment.getId()
            );

            com.razorpay.Payment razorpayPayment =
                    razorpayService.fetchPayment(
                            request.getRazorpayPaymentId()
                    );

            String razorpayPaymentOrderId =
                    razorpayPayment.get("order_id");

            Number razorpayAmount =
                    razorpayPayment.get("amount");

            String razorpayCurrency =
                    razorpayPayment.get("currency");

            String razorpayStatus =
                    razorpayPayment.get("status");

            Boolean captured =
                    razorpayPayment.has("captured")
                            ? razorpayPayment.get("captured")
                            : false;

            if (!storedRazorpayOrderId.equals(
                    razorpayPaymentOrderId
            )) {

                log.warn(
                        "Payment verification failed: Razorpay payment does not belong to stored order, paymentId={}",
                        payment.getId()
                );

                throw new SecurityException(
                        "Razorpay payment does not belong to this order"
                );
            }

            long expectedAmount =
                    Math.round(payment.getAmount() * 100);

            if (razorpayAmount == null
                    || razorpayAmount.longValue() != expectedAmount) {

                log.warn(
                        "Payment verification failed: amount mismatch, paymentId={}",
                        payment.getId()
                );

                throw new SecurityException(
                        "Razorpay payment amount mismatch"
                );
            }

            String expectedCurrency =
                    payment.getCurrency() == null
                            ? "INR"
                            : payment.getCurrency().toUpperCase();

            if (razorpayCurrency == null
                    || !expectedCurrency.equals(
                    razorpayCurrency.toUpperCase()
            )) {

                log.warn(
                        "Payment verification failed: currency mismatch, paymentId={}",
                        payment.getId()
                );

                throw new SecurityException(
                        "Razorpay payment currency mismatch"
                );
            }

            if (!"captured".equalsIgnoreCase(razorpayStatus)
                    || !Boolean.TRUE.equals(captured)) {

                log.warn(
                        "Payment verification failed: payment not captured, paymentId={}, status={}",
                        payment.getId(),
                        razorpayStatus
                );

                throw new IllegalStateException(
                        "Payment is not captured"
                );
            }

            payment.setTransactionId(
                    request.getRazorpayPaymentId()
            );

            payment.setRazorpayPaymentId(
                    request.getRazorpayPaymentId()
            );

            payment.setStatus(
                    PaymentStatus.SUCCESS
            );

            payment.setCompletedAt(
                    LocalDateTime.now()
            );

            paymentRepository.save(payment);

            eventService.saveEvent(
                    payment.getId(),
                    "PAYMENT_SUCCESS",
                    request.getRazorpayPaymentId()
            );

            PaymentCompletedEvent completedEvent =
                    PaymentCompletedEvent.builder()
                            .orderId(
                                    Long.valueOf(
                                            payment.getOrderId()
                                    )
                            )
                            .paymentId(payment.getId())
                            .paymentStatus(
                                    PaymentStatus.SUCCESS.name()
                            )
                            .transactionId(
                                    payment.getTransactionId()
                            )
                            .paidAt(
                                    payment.getCompletedAt()
                            )
                            .build();

            paymentEventProducer.publishPaymentCompleted(
                    completedEvent
            );

            log.info(
                    "Payment verified successfully: paymentId={}, orderId={}, status={}",
                    payment.getId(),
                    payment.getOrderId(),
                    payment.getStatus()
            );

            return PaymentResponse.builder()
                    .paymentId(
                            payment.getId().toString()
                    )
                    .orderId(
                            payment.getOrderId()
                    )
                    .razorpayOrderId(
                            payment.getRazorpayOrderId()
                    )
                    .status(
                            PaymentStatus.SUCCESS.name()
                    )
                    .message(
                            "Payment Verified"
                    )
                    .build();

        } catch (Exception ex) {

            log.error(
                    "Payment verification failed: paymentId={}, error={}",
                    request.getPaymentId(),
                    ex.getMessage(),
                    ex
            );

            throw ex;
        }
    }

    public void processWebhook(
            RazorpayWebhookRequest request
    ) {

        log.info(
                "Payment webhook received: event={}, orderId={}",
                request.getEvent(),
                request.getOrderId()
        );

        try {

            Optional<Payment> paymentOpt =
                    paymentRepository.findByOrderId(
                            request.getOrderId()
                    );

            if (paymentOpt.isEmpty()) {

                log.warn(
                        "Webhook ignored: payment not found for orderId={}",
                        request.getOrderId()
                );

                return;
            }

            Payment payment =
                    paymentOpt.get();

            switch (request.getEvent()) {

                case "payment.captured":

                    payment.setStatus(
                            PaymentStatus.SUCCESS
                    );

                    payment.setCompletedAt(
                            LocalDateTime.now()
                    );

                    log.info(
                            "Payment captured through webhook: paymentId={}, orderId={}",
                            payment.getId(),
                            payment.getOrderId()
                    );

                    break;

                case "payment.failed":

                    payment.setStatus(
                            PaymentStatus.FAILED
                    );

                    log.warn(
                            "Payment failed through webhook: paymentId={}, orderId={}",
                            payment.getId(),
                            payment.getOrderId()
                    );

                    break;

                default:

                    log.debug(
                            "Unsupported payment webhook event ignored: event={}",
                            request.getEvent()
                    );

                    return;
            }

            paymentRepository.save(payment);

            eventService.saveEvent(
                    payment.getId(),
                    request.getEvent(),
                    request.getPaymentId()
            );

            log.info(
                    "Payment webhook processed successfully: paymentId={}, event={}, status={}",
                    payment.getId(),
                    request.getEvent(),
                    payment.getStatus()
            );

        } catch (Exception ex) {

            log.error(
                    "Payment webhook processing failed: orderId={}, event={}, error={}",
                    request.getOrderId(),
                    request.getEvent(),
                    ex.getMessage(),
                    ex
            );

            throw ex;
        }
    }

    public PaymentResponse refundPayment(
            RefundRequest request
    ) {

        log.info(
                "Payment refund started: paymentId={}",
                request.getPaymentId()
        );

        try {

            Payment payment =
                    paymentRepository.findById(
                                    UUID.fromString(
                                            request.getPaymentId()
                                    )
                            )
                            .orElseThrow();

            if (payment.getStatus()
                    != PaymentStatus.SUCCESS) {

                log.warn(
                        "Refund rejected: payment is not successful, paymentId={}, status={}",
                        payment.getId(),
                        payment.getStatus()
                );

                throw new RuntimeException(
                        "Only successful payments can be refunded"
                );
            }

            payment.setStatus(
                    PaymentStatus.REFUNDED
            );

            paymentRepository.save(payment);

            eventService.saveEvent(
                    payment.getId(),
                    "PAYMENT_REFUNDED",
                    payment.getTransactionId()
            );

            log.info(
                    "Payment refund completed: paymentId={}, orderId={}, status={}",
                    payment.getId(),
                    payment.getOrderId(),
                    payment.getStatus()
            );

            return PaymentResponse.builder()
                    .paymentId(
                            payment.getId().toString()
                    )
                    .orderId(
                            payment.getOrderId()
                    )
                    .razorpayOrderId(
                            payment.getRazorpayOrderId()
                    )
                    .status(
                            payment.getStatus().name()
                    )
                    .message(
                            "Refund Processed"
                    )
                    .build();

        } catch (Exception ex) {

            log.error(
                    "Payment refund failed: paymentId={}, error={}",
                    request.getPaymentId(),
                    ex.getMessage(),
                    ex
            );

            throw ex;
        }
    }

    public Long getTotalPayments() {

        log.debug("Fetching total payment count");

        Long count = paymentRepository.count();

        log.info(
                "Total payment count retrieved: count={}",
                count
        );

        return count;
    }

    public Double getTotalRevenue() {

        log.debug("Calculating total successful payment revenue");

        Double revenue =
                paymentRepository.findAll()
                        .stream()
                        .filter(payment ->
                                payment.getStatus()
                                        == PaymentStatus.SUCCESS
                        )
                        .mapToDouble(Payment::getAmount)
                        .sum();

        log.info(
                "Total payment revenue calculated: revenue={}",
                revenue
        );

        return revenue;
    }

    public Long getFailedPayments() {

        log.debug("Fetching failed payment count");

        Long count =
                paymentRepository.countByStatus(
                        PaymentStatus.FAILED
                );

        log.info(
                "Failed payment count retrieved: count={}",
                count
        );

        return count;
    }

    public List<PaymentHistoryResponse> getPaymentsByUserId(
            String userId
    ) {

        log.debug(
                "Fetching payment history for userId={}",
                userId
        );

        List<PaymentHistoryResponse> payments =
                paymentRepository
                        .findByUserId(userId)
                        .stream()
                        .map(payment ->
                                PaymentHistoryResponse.builder()
                                        .paymentId(
                                                payment.getId().toString()
                                        )
                                        .orderId(
                                                payment.getOrderId()
                                        )
                                        .amount(
                                                payment.getAmount()
                                        )
                                        .currency(
                                                payment.getCurrency()
                                        )
                                        .transactionId(
                                                payment.getTransactionId()
                                        )
                                        .status(
                                                payment.getStatus().name()
                                        )
                                        .createdAt(
                                                payment.getCreatedAt()
                                        )
                                        .completedAt(
                                                payment.getCompletedAt()
                                        )
                                        .provider(
                                                payment.getProvider()
                                        )
                                        .build()
                        )
                        .toList();

        log.info(
                "Payment history fetched: userId={}, resultCount={}",
                userId,
                payments.size()
        );

        return payments;
    }

    public List<PaymentHistoryResponse> getAllPayments() {

        log.debug("Fetching all payment records");

        List<PaymentHistoryResponse> payments =
                paymentRepository.findAll()
                        .stream()
                        .map(this::toPaymentHistoryResponse)
                        .toList();

        log.info(
                "All payment records fetched: resultCount={}",
                payments.size()
        );

        return payments;
    }
}