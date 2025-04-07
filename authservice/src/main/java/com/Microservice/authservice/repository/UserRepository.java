package com.Microservice.authservice.repository;

import com.Microservice.authservice.entities.Role;
import com.Microservice.authservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Correct method to find users by role
    List<User> findAllByRolesContaining(Role role);

    // Find user by email
    Optional<User> findByEmail(String email);

    // Find user by reset token
    Optional<User> findByResetToken(String token);
}