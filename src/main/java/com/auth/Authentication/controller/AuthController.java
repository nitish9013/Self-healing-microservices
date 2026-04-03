package com.auth.Authentication.controller;

import com.auth.Authentication.model.User;
import com.auth.Authentication.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

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
    }
}
