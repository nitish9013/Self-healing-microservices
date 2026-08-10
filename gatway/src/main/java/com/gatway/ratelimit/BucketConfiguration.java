package com.gatway.ratelimit;

import io.github.bucket4j.*;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class BucketConfiguration {

    public Bucket createNewBucket() {

        Bandwidth limit = Bandwidth.builder()
                .capacity(100)
                .refillGreedy(
                        100,
                        Duration.ofMinutes(1)
                )
                .build();

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}