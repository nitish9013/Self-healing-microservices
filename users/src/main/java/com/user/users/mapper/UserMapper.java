package com.user.users.mapper;

import com.user.users.dto.UserProfileDTO;
import com.user.users.entity.UserProfile;

public class UserMapper {

    public static UserProfile toEntity(UserProfileDTO dto) {

        if (dto == null) {
            return null;
        }

        UserProfile user = new UserProfile();

        user.setUserId(dto.getUserId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setBio(dto.getBio());

        return user;
    }

    public static UserProfileDTO toDTO(UserProfile entity) {

        if (entity == null) {
            return null;
        }

        UserProfileDTO dto = new UserProfileDTO();

        dto.setUserId(entity.getUserId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setBio(entity.getBio());

        return dto;
    }
}