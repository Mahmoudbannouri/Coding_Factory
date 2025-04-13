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
@RequestMapping("/api/v1/auth")

public class StudentController {

    private final UserRepository userRepository;

    public StudentController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/ids")
    public List<Integer> getAllStudentIds() {
        return getStudentUsers().stream()
                .map(User::getId)
                .collect(Collectors.toList());
    }

    @GetMapping
    public List<Map<String, Object>> getAllStudents() {
        return getStudentUsers().stream()
                .map(user -> {
                    Map<String, Object> studentMap = new HashMap<>();
                    studentMap.put("id", user.getId());
                    studentMap.put("name", user.getName());
                    studentMap.put("email", user.getEmail());
                    return studentMap;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Map<String, Object> getStudentById(@PathVariable Integer id) {
        return userRepository.findById(id)
                .map(user -> {
                    Map<String, Object> studentMap = new HashMap<>();
                    studentMap.put("id", user.getId());
                    studentMap.put("name", user.getName());
                    studentMap.put("email", user.getEmail());
                    return studentMap;
                })
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userRepository.findById(id).orElse(null);
    }
    private List<User> getStudentUsers() {
        return userRepository.findAllByRolesContaining(Role.STUDENT);
    }
}