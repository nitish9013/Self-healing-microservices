// =======================================
// 7. Payment Service
// =======================================

package com.Payment.service;
import com.Payment.event.PaymentCompletedEvent;
import com.Payment.kafka.PaymentEventProducer;
import com.Payment.dto.*;
import com.Payment.entity.Payment;
import com.Payment.entity.PaymentStatus;
import com.Payment.event.PaymentEventService;
import com.Payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentEventService eventService;

    private final PaymentRepository paymentRepository;
    private final RazorpayService razorpayService;
    private final PaymentEventProducer paymentEventProducer;


    public Payment getPayment(
            String paymentId
    ) {

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

        if (request.getOrderId() == null
                || request.getOrderId().isBlank()) {

            throw new IllegalArgumentException(
                    "Order ID is required"
            );
        }

        if (request.getAmount() == null
                || request.getAmount() <= 0) {

            throw new IllegalArgumentException(
                    "Payment amount must be greater than zero"
            );
        }

        if (request.getIdempotencyKey() == null
                || request.getIdempotencyKey().isBlank()) {

            throw new IllegalArgumentException(
                    "Idempotency key is required"
            );
        }

        /*
         * Same request repeated by client.
         * Return existing payment instead of creating
         * another Razorpay order.
         */
        Optional<Payment> existingByKey =
                paymentRepository.findByIdempotencyKey(
                        request.getIdempotencyKey()
                );

        if (existingByKey.isPresent()) {

            Payment existing =
                    existingByKey.get();

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


        /*
         * One payment record per business order.
         */
        if (paymentRepository
                .findByOrderId(request.getOrderId())
                .isPresent()) {

            throw new IllegalStateException(
                    "Payment already exists for order"
            );
        }


        /*
         * Create Razorpay Order only after validation.
         */
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
    }

    public PaymentResponse verifyPayment(
            VerifyPaymentRequest request
    ) throws Exception {

        if (request.getPaymentId() == null
                || request.getRazorpayPaymentId() == null
                || request.getRazorpaySignature() == null) {

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


        /*
         * Never trust the Razorpay Order ID coming
         * from the browser.
         *
         * Use the Razorpay Order ID stored by our
         * backend when the payment was created.
         */
        String storedRazorpayOrderId =
                payment.getRazorpayOrderId();


        if (!storedRazorpayOrderId.equals(
                request.getRazorpayOrderId()
        )) {

            throw new SecurityException(
                    "Razorpay order mismatch"
            );
        }


        /*
         * Prevent replay / duplicate successful
         * verification.
         */
        if (payment.getStatus()
                == PaymentStatus.SUCCESS) {

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


        /*
         * Prevent the same Razorpay payment from
         * being attached to another payment record.
         */
        Optional<Payment> existingPayment =
                paymentRepository
                        .findByRazorpayPaymentId(
                                request.getRazorpayPaymentId()
                        );

        if (existingPayment.isPresent()
                && !existingPayment.get()
                .getId()
                .equals(payment.getId())) {

            throw new SecurityException(
                    "Razorpay payment is already associated with another payment"
            );
        }


        /*
         * Verify Razorpay signature using OUR stored
         * Razorpay order ID.
         */
        boolean valid =
                razorpayService.verifySignature(
                        storedRazorpayOrderId,
                        request.getRazorpayPaymentId(),
                        request.getRazorpaySignature()
                );


        if (!valid) {

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


        /*
         * Signature is valid.
         *
         * Now fetch the actual payment from Razorpay
         * and verify its server-side details.
         */
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


        /*
         * 1. Payment must belong to our Razorpay Order.
         */
        if (!storedRazorpayOrderId.equals(
                razorpayPaymentOrderId
        )) {

            throw new SecurityException(
                    "Razorpay payment does not belong to this order"
            );
        }


        /*
         * 2. Payment amount must match our database amount.
         */
        long expectedAmount =
                Math.round(payment.getAmount() * 100);

        if (razorpayAmount == null
                || razorpayAmount.longValue() != expectedAmount) {

            throw new SecurityException(
                    "Razorpay payment amount mismatch"
            );
        }


        /*
         * 3. Currency must match.
         */
        String expectedCurrency =
                payment.getCurrency() == null
                        ? "INR"
                        : payment.getCurrency().toUpperCase();

        if (razorpayCurrency == null
                || !expectedCurrency.equals(
                razorpayCurrency.toUpperCase()
        )) {

            throw new SecurityException(
                    "Razorpay payment currency mismatch"
            );
        }


        /*
         * 4. Payment must actually be captured.
         */
        if (!"captured".equalsIgnoreCase(razorpayStatus)
                || !Boolean.TRUE.equals(captured)) {

            throw new IllegalStateException(
                    "Payment is not captured"
            );
        }


        /*
         * All server-side verification checks passed.
         */
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
                        .orderId(Long.valueOf(payment.getOrderId()))
                        .paymentId(payment.getId())
                        .paymentStatus(PaymentStatus.SUCCESS.name())
                        .transactionId(payment.getTransactionId())
                        .paidAt(payment.getCompletedAt())
                        .build();

        paymentEventProducer.publishPaymentCompleted(completedEvent);


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
    }

    public void processWebhook(
            RazorpayWebhookRequest request
    ) {

        Optional<Payment> paymentOpt =
                paymentRepository.findByOrderId(
                        request.getOrderId()
                );

        if(paymentOpt.isEmpty()) {

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

                break;

            case "payment.failed":

                payment.setStatus(
                        PaymentStatus.FAILED
                );

                break;

            default:
                return;
        }

        paymentRepository.save(payment);

        eventService.saveEvent(
                payment.getId(),
                request.getEvent(),
                request.getPaymentId()
        );
    }


    public PaymentResponse refundPayment(
            RefundRequest request
    ) {

        Payment payment =
                paymentRepository.findById(
                                UUID.fromString(
                                        request.getPaymentId()
                                )
                        )
                        .orElseThrow();

        if(payment.getStatus()
                != PaymentStatus.SUCCESS) {

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
    }


    public Long getTotalPayments() {
        return paymentRepository.count();
    }


    public Double getTotalRevenue() {

        return paymentRepository.findAll()
                .stream()
                .filter(payment ->
                        payment.getStatus() == PaymentStatus.SUCCESS
                )
                .mapToDouble(Payment::getAmount)
                .sum();
    }


    public Long getFailedPayments() {
        return paymentRepository.countByStatus(PaymentStatus.FAILED);
    }
}