package com.gatway.ratelimit;

import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private final BucketConfiguration bucketConfiguration;

    private final Map<String, Bucket> buckets =
            new ConcurrentHashMap<>();

    public RateLimitService(
            BucketConfiguration bucketConfiguration) {

        this.bucketConfiguration = bucketConfiguration;
    }

    public Bucket resolveBucket(String username) {

        return buckets.computeIfAbsent(

                username,

                key -> bucketConfiguration.createNewBucket()

        );

    }

}