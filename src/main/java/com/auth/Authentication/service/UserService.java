package com.auth.Authentication.service;

import com.auth.Authentication.model.User;

public interface UserService {
    User register(User user);
    User login(String username, String password);
}