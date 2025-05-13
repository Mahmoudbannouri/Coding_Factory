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
@RequestMapping("/api/v1/auth/partners")
@CrossOrigin(origins = "http://localhost:4200")
public class PartnerController {

    private final UserRepository userRepository;

    public PartnerController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/ids")
    public List<Integer> getAllPartnerIds() {
        return getPartnerUsers().stream()
                .map(User::getId)
                .collect(Collectors.toList());
    }

    @GetMapping
    public List<User> getAllPartners() {
        return getPartnerUsers();
    }

    @GetMapping("/{id}")
    public User getPartnerById(@PathVariable Integer id) {
        return userRepository.findById(id)
                .filter(user -> user.getRoles().contains(Role.PARTNER))
                .orElseThrow(() -> new RuntimeException("Partner not found"));
    }

    private List<User> getPartnerUsers() {
        return userRepository.findAllByRolesContaining(Role.PARTNER);
    }
}

