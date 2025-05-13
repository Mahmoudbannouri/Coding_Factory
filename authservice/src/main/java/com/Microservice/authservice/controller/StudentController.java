package com.Microservice.authservice.controller;

import com.Microservice.authservice.entities.Role;
import com.Microservice.authservice.entities.User;
import com.Microservice.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")

public class StudentController {

    @Value("${welcome.message}")
    private String welcomeMessage;
    @GetMapping("/welcome")
    public String welcome() {
        return welcomeMessage;
    }
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

    @GetMapping("/students")
    public ResponseEntity<List<Map<String, Object>>> getAllStudents() {
        List<User> students = getStudentUsers();

        List<Map<String, Object>> response = students.stream()
                .map(user -> {
                    Map<String, Object> studentMap = new HashMap<>();
                    studentMap.put("id", user.getId());
                    studentMap.put("name", user.getName());
                    studentMap.put("email", user.getEmail());
                    return studentMap;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<Map<String, Object>> getStudentById(@PathVariable("id") Integer id) {
        return userRepository.findById(id)
                .map(user -> {
                    Map<String, Object> studentMap = new HashMap<>();
                    studentMap.put("id", user.getId());
                    studentMap.put("name", user.getName());
                    studentMap.put("email", user.getEmail());
                    return ResponseEntity.ok(studentMap);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userRepository.findById(id).orElse(null);
    }
    private List<User> getStudentUsers() {
        return userRepository.findAllByRolesContaining(Role.STUDENT);
    }}
