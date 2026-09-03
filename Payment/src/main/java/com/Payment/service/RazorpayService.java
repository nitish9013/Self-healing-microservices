package com.Payment.service;

import com.Payment.config.RazorpayConfig;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RazorpayService {

    private final RazorpayConfig razorpayConfig;

    public Order createOrder(
            Double amount,
            String currency
    ) throws Exception {

        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException(
                    "Payment amount must be greater than zero"
            );
        }

        String finalCurrency =
                currency == null || currency.isBlank()
                        ? "INR"
                        : currency.toUpperCase();

        RazorpayClient client =
                new RazorpayClient(
                        razorpayConfig.getKey(),
                        razorpayConfig.getSecret()
                );

        JSONObject options =
                new JSONObject();

        /*
         * Razorpay expects amount in smallest currency unit.
         * INR 100 = 10000 paise.
         */
        options.put(
                "amount",
                Math.round(amount * 100)
        );

        options.put(
                "currency",
                finalCurrency
        );

        options.put(
                "receipt",
                UUID.randomUUID().toString()
        );

        /*
         * Partial payments are not allowed for our
         * normal order-payment flow.
         */
        options.put(
                "partial_payment",
                false
        );

        return client.orders.create(options);
    }


    public boolean verifySignature(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    ) {

        if (isBlank(razorpayOrderId)
                || isBlank(razorpayPaymentId)
                || isBlank(razorpaySignature)) {

            return false;
        }

        try {

            JSONObject options =
                    new JSONObject();

            options.put(
                    "razorpay_order_id",
                    razorpayOrderId
            );

            options.put(
                    "razorpay_payment_id",
                    razorpayPaymentId
            );

            options.put(
                    "razorpay_signature",
                    razorpaySignature
            );

            return Utils.verifyPaymentSignature(
                    options,
                    razorpayConfig.getSecret()
            );

        } catch (Exception e) {

            return false;
        }
    }


    public com.razorpay.Payment fetchPayment(
            String razorpayPaymentId
    ) throws Exception {

        if (razorpayPaymentId == null
                || razorpayPaymentId.isBlank()) {

            throw new IllegalArgumentException(
                    "Razorpay payment ID is required"
            );
        }

        RazorpayClient client =
                new RazorpayClient(
                        razorpayConfig.getKey(),
                        razorpayConfig.getSecret()
                );

        return client.payments.fetch(
                razorpayPaymentId
        );
    }


    private boolean isBlank(String value) {

        return value == null
                || value.isBlank();
    }
}