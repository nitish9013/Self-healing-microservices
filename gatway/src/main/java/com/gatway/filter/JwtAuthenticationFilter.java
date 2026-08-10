package com.gatway.filter;

import com.gatway.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import com.gatway.ratelimit.RateLimitService;
import io.github.bucket4j.Bucket;
import java.nio.charset.StandardCharsets;
import java.sql.SQLOutput;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        implements GlobalFilter, Ordered {

    private final JwtUtil jwtUtil;
    private final RateLimitService rateLimitService;

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            GatewayFilterChain chain) {

        String path =
                exchange.getRequest()
                        .getURI()
                        .getPath();


        System.out.println("PATH =" +path);
        // login/register ko allow karo

        if (path.startsWith("/auth")) {
            System.out.println("AUTH PATH DETECTED");

            return chain.filter(exchange);
        }

        String authHeader =
                exchange.getRequest()
                        .getHeaders()
                        .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            exchange.getResponse()
                    .setStatusCode(
                            org.springframework.http.HttpStatus.UNAUTHORIZED
                    );

            return exchange.getResponse()
                    .setComplete();
        }

        String token =
                authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {

            exchange.getResponse()
                    .setStatusCode(
                            org.springframework.http.HttpStatus.UNAUTHORIZED
                    );

            return exchange.getResponse()
                    .setComplete();
        }

        String username =
                jwtUtil.extractUsername(token);
        System.out.println("USERNAME = " + username);

        Bucket bucket = rateLimitService.resolveBucket(username);

        System.out.println("Bucket = " + bucket);

        boolean allowed = bucket.tryConsume(1);

        System.out.println("Allowed = " + allowed);

        if (!bucket.tryConsume(1)) {

            exchange.getResponse().setStatusCode(
                    org.springframework.http.HttpStatus.TOO_MANY_REQUESTS);

            exchange.getResponse().getHeaders()
                    .add("Content-Type", "application/json");

            String body = """
            {
              "status":429,
              "error":"Too Many Requests",
              "message":"Rate limit exceeded. Please try again later."
            }
            """;

            byte[] bytes = body.getBytes(StandardCharsets.UTF_8);

            return exchange.getResponse().writeWith(
                    Mono.just(
                            exchange.getResponse()
                                    .bufferFactory()
                                    .wrap(bytes)
                    )
            );
        }

        ServerHttpRequest request =
                exchange.getRequest()
                        .mutate()
                        .header("X-Username",
                                username)
                        .build();

        return chain.filter(
                exchange.mutate()
                        .request(request)
                        .build()
        );
    }

    @Override
    public int getOrder() {

        return -1;
    }
}