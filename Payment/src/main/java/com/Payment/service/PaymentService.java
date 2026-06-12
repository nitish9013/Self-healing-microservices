// =======================================
// 7. Payment Service
// =======================================

package com.Payment.service;

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



    public PaymentResponse createPayment(PaymentRequest request) throws Exception
    {

        if(paymentRepository.findByOrderId(request.getOrderId()).isPresent())
        {

            throw new RuntimeException("Payment already exists for order");
        }

        var order = razorpayService.createOrder(request.getAmount(), request.getCurrency());

        Payment payment =
                Payment.builder()
                        .orderId(request.getOrderId())
                        .userId(request.getUserId())
                        .amount(request.getAmount())
                        .provider("RAZORPAY")
                        .status(PaymentStatus.PENDING)
                        .razorpayOrderId(order.get("id"))
                        .retryCount(0)
                        .build();

        payment = paymentRepository.save(payment);

        eventService.saveEvent(payment.getId(), "PAYMENT_CREATED", payment.getOrderId());

        return PaymentResponse.builder()
                .paymentId(payment.getId().toString())
                .orderId(payment.getOrderId())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .status(payment.getStatus().name())
                .message("Payment Created")
                .build();
    }

    public PaymentResponse verifyPayment(
            VerifyPaymentRequest request
    ) {

        Payment payment =
                paymentRepository.findById(
                                UUID.fromString(
                                        request.getPaymentId()
                                )
                        )
                        .orElseThrow();

        boolean valid =
                razorpayService.verifySignature(
                        request.getRazorpayOrderId(),
                        request.getRazorpayPaymentId(),
                        request.getRazorpaySignature()
                );

        if (!valid) {

            throw new RuntimeException(
                    "Invalid Razorpay Signature"
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
                java.time.LocalDateTime.now()
        );

        paymentRepository.save(payment);

        eventService.saveEvent(
                payment.getId(),
                "PAYMENT_SUCCESS",
                request.getRazorpayPaymentId()
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
                .status("SUCCESS")
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
}