package com.dashboard.feign;

import com.dashboard.dto.response.UserSummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "user-service",
        url = "${user.service.url}"
)
public interface UserFeignClient {

    @GetMapping("/api/users/{id}")
    UserSummaryResponse getUser(
            @PathVariable Long id
    );
}