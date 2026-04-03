package com.auth.Authentication.service;

import com.auth.Authentication.model.User;

import java.util.List;

public interface UserService {
    User register(User user);
    String login(String username, String password);
    void removeUser(Long id);
    List<User> getAllUsers();
}
