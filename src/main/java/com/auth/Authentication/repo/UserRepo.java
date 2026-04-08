package com.auth.Authentication.repo;

import com.auth.Authentication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
 Optional<User> findByUsername(String username);
 Optional<User> findByEmail(String email);
}