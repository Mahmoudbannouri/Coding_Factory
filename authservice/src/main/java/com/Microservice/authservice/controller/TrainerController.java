package com.Microservice.authservice.controller;

import com.Microservice.authservice.entities.Role;
import com.Microservice.authservice.entities.User;
import com.Microservice.authservice.repository.UserRepository;
import io.micrometer.common.KeyValues;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth/trainers")
public class TrainerController {
    private final UserRepository userRepository;

    public TrainerController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/ids")
    public List<Integer> getAllTrainerIds() {
        return getTrainerUsers().stream()
                .map(User::getId)
                .collect(Collectors.toList());
    }

    @GetMapping
    public List<Map<String, Object>> getAllTrainers() {
      return getTrainerUsers().stream()
              .map(user -> {
                  Map<String,Object> trainerMap=new HashMap<>();
                  trainerMap.put("id",user.getId());
                  trainerMap.put("name",user.getName());
                  trainerMap.put("email",user.getEmail());
                  return trainerMap;

              })
              .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Map<String, Object> getTrainerById(@PathVariable Integer id) {
        return userRepository.findById(id)
                .map(user -> {
                    Map<String, Object> trainerMap = new HashMap<>();
                    trainerMap.put("id", user.getId());
                    trainerMap.put("name", user.getName());
                    trainerMap.put("email", user.getEmail());
                    return trainerMap;
                })
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
    }
    private List<User> getTrainerUsers() {
        return userRepository.findAllByRolesContaining(Role.TRAINER);
    }
}
