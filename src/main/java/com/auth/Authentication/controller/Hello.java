package com.auth.Authentication.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Hello {
@GetMapping("/")
    public String greet(HttpServletRequest request){
        return "Welcome to the project" + request.getSession().getId();
    }
}
