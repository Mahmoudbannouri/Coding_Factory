package com.PIDEV.Auth.Service.Controller;

import com.PIDEV.Auth.Service.Dto.AuthResponse;
import com.PIDEV.Auth.Service.Dto.LoginRequest;
import com.PIDEV.Auth.Service.Dto.RegisterRequest;
import com.PIDEV.Auth.Service.Entity.User;
import com.PIDEV.Auth.Service.Services.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest registerRequest) {
        User newUser = new User();
        newUser.setName(registerRequest.getName());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPhoneNumber(registerRequest.getPhoneNumber());
        newUser.setAddress(registerRequest.getAddress());
        newUser.setDateOfBirth(registerRequest.getDateOfBirth());
        newUser.setRole(registerRequest.getRole());

        // Register the user via Keycloak
        User registeredUser = authService.register(newUser, registerRequest.getPassword());
        return ResponseEntity.ok(registeredUser);
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> tokens = authService.login(loginRequest.getEmail(), loginRequest.getPassword());

        // Create response for access and refresh tokens
        AuthResponse response = new AuthResponse();
        response.setAccessToken((String) tokens.get("access_token"));
        response.setRefreshToken((String) tokens.get("refresh_token"));
        response.setExpiresIn((Integer) tokens.get("expires_in"));

        return ResponseEntity.ok(response);
    }
}
