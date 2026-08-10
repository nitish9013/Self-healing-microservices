package com.auth.Authentication.service;

import com.auth.Authentication.client.UserProfileClient;
import com.auth.Authentication.dto.UserProfileDTO;
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
    private final UserProfileClient userProfileClient;

    public UserServiceImpl(
            UserRepo repo,
            PasswordEncoder encoder,
            UserProfileClient userProfileClient
    ) {
        this.repo = repo;
        this.encoder = encoder;
        this.userProfileClient = userProfileClient;
    }

    @Override
    public User register(User user) {

        repo.findByUsername(user.getUsername()).ifPresent(u -> {
            throw new RuntimeException("Username already taken");
        });

        repo.findByEmail(user.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email already registered");
        });

        user.setPassword(
                encoder.encode(user.getPassword())
        );

        if (user.getRoles() == null ||
                user.getRoles().isEmpty()) {

            user.setRoles(new HashSet<>());
            user.getRoles().add("USER");
        }

        // 1. Save user in Auth DB
        User savedUser = repo.save(user);

        // 2. Create corresponding profile
        //    in User Service using SAME ID
        UserProfileDTO profile =
                new UserProfileDTO();

        profile.setUserId(savedUser.getId());
        profile.setName(savedUser.getUsername());
        profile.setEmail(savedUser.getEmail());
        profile.setBio("");

        userProfileClient.createUser(profile);

        return savedUser;
    }

    @Override
    public User login(String username, String password) {

        System.out.println("USERNAME = " + username);
        System.out.println("PASSWORD = " + password);

        User user = repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("DB USERNAME = " + user.getUsername());

        boolean match =
                encoder.matches(
                        password,
                        user.getPassword()
                );

        System.out.println("PASSWORD MATCH = " + match);

        if (!match) {
            throw new RuntimeException(
                    "Invalid credentials");
        }

        return user;
    }
}