package com.auth.Authentication.client;

import com.auth.Authentication.dto.UserProfileDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "user-service",
        url = "http://localhost:8082"
)
public interface UserProfileClient {

    @PostMapping("/api/users")
    UserProfileDTO createUser(
            @RequestBody UserProfileDTO userProfile
    );
}