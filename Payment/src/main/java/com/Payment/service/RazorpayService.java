package com.Payment.service;

import com.Payment.config.RazorpayConfig;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.UUID;



@Service
@RequiredArgsConstructor
public class RazorpayService {

    private final RazorpayConfig razorpayConfig;

    public Order createOrder(
            Double amount,
            String currency
    ) throws Exception {

        RazorpayClient client =
                new RazorpayClient(
                        razorpayConfig.getKey(),
                        razorpayConfig.getSecret()
                );

        JSONObject options =
                new JSONObject();

        options.put("amount", amount * 100);

        options.put(
                "currency",
                currency == null ? "INR" : currency
        );

        options.put(
                "receipt",
                UUID.randomUUID().toString()
        );

        return client.orders.create(options);
    }

    public boolean verifySignature(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    ) {

        try {

            String payload =
                    razorpayOrderId +
                            "|" +
                            razorpayPaymentId;

            Mac sha256Hmac =
                    Mac.getInstance(
                            "HmacSHA256"
                    );

            SecretKeySpec secretKey =
                    new SecretKeySpec(
                            razorpayConfig.getSecret()
                                    .getBytes(),
                            "HmacSHA256"
                    );

            sha256Hmac.init(secretKey);

            byte[] hash =
                    sha256Hmac.doFinal(
                            payload.getBytes()
                    );

            String generatedSignature =
                    Base64.getEncoder()
                            .encodeToString(hash);

            return generatedSignature.equals(
                    razorpaySignature
            );

        } catch (Exception e) {

            return false;
        }
    }

}