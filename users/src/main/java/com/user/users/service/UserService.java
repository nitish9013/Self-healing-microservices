package com.user.users.service;

import com.user.users.dto.UserProfileDTO;

public interface UserService {

    UserProfileDTO getUser(Long userId);

    UserProfileDTO createUser(UserProfileDTO dto);

    UserProfileDTO updateUser(Long userId, UserProfileDTO dto);
}