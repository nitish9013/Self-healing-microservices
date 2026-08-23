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

    private Mono<Void> forbidden(
            ServerWebExchange exchange) {

        exchange.getResponse().setStatusCode(
                org.springframework.http.HttpStatus.FORBIDDEN
        );

        exchange.getResponse()
                .getHeaders()
                .add(
                        HttpHeaders.CONTENT_TYPE,
                        "application/json"
                );

        String body = """
            {
              "status":403,
              "error":"FORBIDDEN",
              "message":"You do not have permission to perform this operation."
            }
            """;

        byte[] bytes =
                body.getBytes(StandardCharsets.UTF_8);

        return exchange.getResponse().writeWith(
                Mono.just(
                        exchange.getResponse()
                                .bufferFactory()
                                .wrap(bytes)
                )
        );
    }



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

        String username = jwtUtil.extractUsername(token);

        java.util.List<String> roles =
                jwtUtil.extractRoles(token);

        System.out.println("USERNAME = " + username);
        System.out.println("ROLES = " + roles);


/* =================================================
   ROLE BASED AUTHORIZATION
================================================= */

        org.springframework.http.HttpMethod method =
                exchange.getRequest().getMethod();

        boolean isAdmin =
                roles.contains("ADMIN");

        boolean isSalesman =
                roles.contains("SALESMAN");

        boolean isReadRequest =
                method == org.springframework.http.HttpMethod.GET;


        /*
         * GET requests:
         * USER / SALESMAN / ADMIN → allowed
         */
        if (!isReadRequest) {

            boolean isProductCreateOrUpdate =
                    path.startsWith("/catalog/api/products")
                            && (
                            method == org.springframework.http.HttpMethod.POST
                                    || method == org.springframework.http.HttpMethod.PUT
                    );

            boolean isProductDelete =
                    path.startsWith("/catalog/api/products")
                            && method == org.springframework.http.HttpMethod.DELETE;

            boolean isCategoryManagement =
                    path.startsWith("/catalog/api/categories")
                            && (
                            method == org.springframework.http.HttpMethod.POST
                                    || method == org.springframework.http.HttpMethod.PUT
                                    || method == org.springframework.http.HttpMethod.DELETE
                    );


            /*
             * Product Create / Update
             * SALESMAN / ADMIN
             */
            if (isProductCreateOrUpdate
                    && !(isAdmin || isSalesman)) {

                return forbidden(exchange);
            }


            /*
             * Product Delete
             * ADMIN only
             */
            if (isProductDelete && !isAdmin) {

                return forbidden(exchange);
            }


            /*
             * Category Management
             * ADMIN only
             */
            if (isCategoryManagement && !isAdmin) {

                return forbidden(exchange);
            }
        }


        Bucket bucket = rateLimitService.resolveBucket(username);

        System.out.println("Bucket = " + bucket);

        boolean allowed =
                bucket.tryConsume(1);

        System.out.println(
                "Allowed = " + allowed
        );

        if (!allowed) {

            exchange.getResponse().setStatusCode(
                    org.springframework.http.HttpStatus.TOO_MANY_REQUESTS
            );

            exchange.getResponse()
                    .getHeaders()
                    .add(
                            "Content-Type",
                            "application/json"
                    );

            String body = """
            {
              "status":429,
              "error":"Too Many Requests",
              "message":"Rate limit exceeded. Please try again later."
            }
            """;

            byte[] bytes =
                    body.getBytes(StandardCharsets.UTF_8);

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