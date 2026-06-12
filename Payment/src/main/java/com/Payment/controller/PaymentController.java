// =======================================
// 8. Controller
// =======================================

package com.Payment.controller;

import com.Payment.dto.*;
import com.Payment.entity.Payment;
import com.Payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/{paymentId}")
    public Payment getPayment(
            @PathVariable String paymentId
    ) {

        return paymentService.getPayment(
                paymentId
        );
    }

    @PostMapping("/create")
    public PaymentResponse createPayment(
            @RequestBody PaymentRequest request
    ) throws Exception {

        return paymentService.createPayment(request);
    }

    @PostMapping("/verify")
    public PaymentResponse verifyPayment(
            @RequestBody VerifyPaymentRequest request
    ) {

        return paymentService.verifyPayment(
                request
        );
    }


    @PostMapping("/webhook")
    public String handleWebhook(
            @RequestBody RazorpayWebhookRequest request
    ) {

        paymentService.processWebhook(
                request
        );

        return "Webhook Processed";
    }

    @PostMapping("/refund")
    public PaymentResponse refundPayment(
            @RequestBody RefundRequest request
    ) {

        return paymentService.refundPayment(
                request
        );
    }
}