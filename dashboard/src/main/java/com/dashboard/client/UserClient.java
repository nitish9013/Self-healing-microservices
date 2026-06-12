package com.dashboard.client;

import com.dashboard.dto.response.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class UserClient {

    private final WebClient webClient;

    @Value("${user.service.url}")
    private String userServiceUrl;

    public UserSummaryResponse getUser(
            Long userId) {

        return webClient.get()
                .uri(userServiceUrl +
                        "/api/users/" +
                        userId)
                .retrieve()
                .bodyToMono(
                        UserSummaryResponse.class)
                .block();
    }
}