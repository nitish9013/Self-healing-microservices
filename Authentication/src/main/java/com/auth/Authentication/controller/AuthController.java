package com.auth.Authentication.controller;

import com.auth.Authentication.config.JwtUtil;
import com.auth.Authentication.model.User;
import com.auth.Authentication.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.auth.Authentication.dto.AdminUserResponse;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService service;
    private final JwtUtil jwtUtil;

    public AuthController(UserService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        log.info(
                "Registration request received username={}",
                user.getUsername()
        );

        try {

            User registered = service.register(user);

            log.info(
                    "Registration successful username={}",
                    registered.getUsername()
            );

            return ResponseEntity.ok(registered);

        } catch (Exception e) {

            log.error(
                    "Registration failed username={}",
                    user.getUsername(),
                    e
            );

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        log.info(
                "Login request received username={}",
                user.getUsername()
        );

        try {

            User loggedIn =
                    service.login(
                            user.getUsername(),
                            user.getPassword()
                    );

            String token =
                    jwtUtil.generateAccessToken(loggedIn);

            log.info(
                    "Authentication successful username={}",
                    loggedIn.getUsername()
            );

            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "userId", loggedIn.getId()
                    )
            );

        } catch (Exception e) {

            log.error(
                    "Authentication failed username={}",
                    user.getUsername(),
                    e
            );

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {

        List<AdminUserResponse> users =
                service.getAllUsers()
                        .stream()
                        .map(user -> AdminUserResponse.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .roles(user.getRoles())
                                .active(user.isActive())
                                .build()
                        )
                        .toList();

        return ResponseEntity.ok(users);
    }
}