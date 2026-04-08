package com.auth.Authentication.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RedirectController {
    @GetMapping("/auth/**")
    public String redirectToAuth() {
        return "redirect:/index.html";
    }
}


