package com.user.users.service.impl;

import com.user.users.dto.UserProfileDTO;
import com.user.users.entity.UserProfile;
import com.user.users.exception.ResourceNotFoundException;
import com.user.users.mapper.UserMapper;
import com.user.users.repository.UserRepository;
import com.user.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service

public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    public UserServiceImpl(UserRepository userRepository){
        this.userRepository=userRepository;
    }
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    @Override
    public UserProfileDTO getUser(Long userId) {
        log.info("Fetching user with id: {}", userId);

        UserProfile user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return UserMapper.toDTO(user);
    }

    @Override
    public UserProfileDTO createUser(UserProfileDTO dto) {
        log.info("Creating user with email: {}", dto.getEmail());

        UserProfile saved = userRepository.save(UserMapper.toEntity(dto));

        return UserMapper.toDTO(saved);
    }

    @Override
    public UserProfileDTO updateUser(Long userId, UserProfileDTO dto) {
        log.info("Updating user with id: {}", userId);

        UserProfile user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setBio(dto.getBio());

        return UserMapper.toDTO(userRepository.save(user));
    }
}