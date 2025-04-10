package com.Microservice.authservice.service.impl;

import com.Microservice.authservice.dao.request.SignUpRequest;
import com.Microservice.authservice.dao.request.SingninRequest;
import com.Microservice.authservice.dao.request.response.JwtAuthenticationResponse;
import com.Microservice.authservice.entities.Role;
import com.Microservice.authservice.entities.User;
import com.Microservice.authservice.repository.UserRepository;
import com.Microservice.authservice.service.AuthenticationService;
import com.Microservice.authservice.service.JwtService;
import com.Microservice.authservice.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Override
    public JwtAuthenticationResponse SignUp(SignUpRequest request) {
        // Assign default role if no roles are provided
        Set<Role> assignedRoles = request.getRoles() != null ? request.getRoles() : Set.of(Role.STUDENT);

        // Create new User entity
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .dateOfBirth(request.getDateOfBirth())
                .roles(assignedRoles) // Updated to handle multiple roles
                .build();

        // Save user to the database
        userRepository.save(user);

        // Generate JWT & Refresh Token
        var jwt = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user);

        return JwtAuthenticationResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken.getToken())
                .role(assignedRoles.toString()) // Convert Set<Role> to String
                .userId(user.getId())
                .build();
    }

    @Override
    public JwtAuthenticationResponse SignIn(SingninRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        // Fetch user from DB
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // Generate JWT & Refresh Token
        var jwt = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user);

        return JwtAuthenticationResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken.getToken())
                .role(user.getRoles().toString()) // Convert Set<Role> to String
                .userId(user.getId())
                .build();
    }
}
