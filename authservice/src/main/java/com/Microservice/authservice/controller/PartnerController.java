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
    public List<Map<String,Object>> getAllPartner() {
        return userRepository.findAllByRolesContaining(Role.STUDENT).stream()
                .map(user -> {
                    Map<String, Object> partnerMap =new HashMap<>();
                    partnerMap.put("id", user.getId());
                    partnerMap.put("name", user.getName());
                    partnerMap.put("email", user.getEmail());
                    return partnerMap;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Map<String, Object> getPartnerById(@PathVariable Integer id) {
        return userRepository.findById(id)
                .map(user -> {
                    Map<String, Object> partnerMap = new HashMap<>();
                    partnerMap.put("id", user.getId());
                    partnerMap.put("name", user.getName());
                    partnerMap.put("email", user.getEmail());
                    return partnerMap;
                })
                .orElseThrow(() -> new RuntimeException("Partner not found"));
    }
    private List<User> getPartnerUsers() {
        return userRepository.findAllByRolesContaining(Role.PARTNER);
    }
}
