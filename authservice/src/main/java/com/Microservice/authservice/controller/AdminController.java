package com.Microservice.authservice.controller;

import com.Microservice.authservice.entities.Role;
import com.Microservice.authservice.entities.User;
import com.Microservice.authservice.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth/admins")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/ids")
    public List<Integer> getAllAdminIds() {
        return getAdminUsers().stream()
                .map(User::getId)
                .collect(Collectors.toList());
    }

    @GetMapping
    public List<User> getAllAdmins() {
        return getAdminUsers();
    }

    @GetMapping("/{id}")
    public User getAdminById(@PathVariable Integer id) {
        return userRepository.findById(id)
                .filter(user -> user.getRoles().contains(Role.ADMIN))
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    private List<User> getAdminUsers() {
        return userRepository.findAllByRolesContaining(Role.ADMIN);
    }
}
