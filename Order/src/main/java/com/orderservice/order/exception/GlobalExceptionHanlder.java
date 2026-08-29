package com.orderservice.order.exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHanlder {

    @ExceptionHandler(CatalogServiceUnavailableException.class)
    public ResponseEntity<?> handleCatalogUnavailable(
            CatalogServiceUnavailableException ex) {

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                        "status", 503,
                        "error", "CATALOG_SERVICE_UNAVAILABLE",
                        "message", ex.getMessage()
                ));
    }
}
