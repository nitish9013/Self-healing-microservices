package com.auth.Authentication.service;

import com.auth.Authentication.model.User;
import com.auth.Authentication.repo.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.HashSet;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepo repo;
    private final PasswordEncoder encoder;

    public UserServiceImpl(UserRepo repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Override
    public User register(User user) {
        repo.findByUsername(user.getUsername()).ifPresent(u -> {
            throw new RuntimeException("Username already taken");
        });
        repo.findByEmail(user.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email already registered");
        });

        user.setPassword(encoder.encode(user.getPassword()));

        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(new HashSet<>());
            user.getRoles().add("USER");
        }

        return repo.save(user);
    }

    @Override
    public User login(String username, String password) {
        User user = repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isActive()) {
            throw new RuntimeException("User account is inactive");
        }

        return user;
    }
}