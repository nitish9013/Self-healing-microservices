package com.auth.Authentication.controller;

import com.auth.Authentication.config.JwtUtil;
import com.auth.Authentication.model.User;
import com.auth.Authentication.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("auth")
public class AuthController {

    private final UserService service;
    private final JwtUtil jwtUtil;

<<<<<<< HEAD
    public AuthController(UserService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            return ResponseEntity.ok(service.register(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        User loggedIn = service.login(user.getUsername(), user.getPassword());
        String token = jwtUtil.generateAccessToken(loggedIn);
        return Map.of("token", token);
=======
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping({"/register", "/login"})
    public String showAuthPage(Model model) {
        model.addAttribute("user", new User());
        return "auth"; 
    }

    @PostMapping("/register")
    public String register(@ModelAttribute User user, Model model) {
        userService.register(user);
        model.addAttribute("message", "Registration successful!");
        return "redirect:/auth/login"; 
    }



    @PostMapping("/login")
    public String login(@ModelAttribute User user, Model model) {
        try {
            String token = userService.login(user.getUsername(), user.getPassword());
            model.addAttribute("message", "Login successful! JWT: " + token);
            return "redirect:/auth/dashboard"; 
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "login"; 
        }
    }

    @GetMapping("/dashboard")
    public String showDashboard(Model model) {
        return "dashboard"; 

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public String listUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "users";
>>>>>>> bc6e37b5158a5e6ea073b47570b5a8e16f902ec3
    }
}
