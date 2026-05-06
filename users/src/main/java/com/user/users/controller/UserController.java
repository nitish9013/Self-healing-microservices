package com.user.users.controller;

import com.user.users.dto.UserProfileDTO;
import com.user.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")

public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService=userService;
    }

    @GetMapping("/{id}")
    public UserProfileDTO getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }

    @PostMapping
    public UserProfileDTO createUser(@Valid @RequestBody UserProfileDTO dto) {
        return userService.createUser(dto);
    }

    @PutMapping("/{id}")
    public UserProfileDTO updateUser(@PathVariable Long id,
                                     @Valid @RequestBody UserProfileDTO dto) {
        return userService.updateUser(id, dto);
    }
}