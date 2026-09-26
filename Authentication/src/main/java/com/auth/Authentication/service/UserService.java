package com.auth.Authentication.service;

import com.auth.Authentication.model.User;

import java.util.List;

public interface UserService {

    User register(User user);

    User login(String username, String password);

    List<User> getAllUsers();
}