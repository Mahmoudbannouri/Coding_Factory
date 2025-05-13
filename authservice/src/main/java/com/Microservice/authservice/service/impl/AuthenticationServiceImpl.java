package com.Microservice.authservice.service.impl;

import com.Microservice.authservice.dao.request.ResetPasswordRequest;
import com.Microservice.authservice.dao.request.SignUpRequest;
import com.Microservice.authservice.dao.request.SingninRequest;
import com.Microservice.authservice.dao.request.response.JwtAuthenticationResponse;
import com.Microservice.authservice.entities.Role;
import com.Microservice.authservice.entities.User;
import com.Microservice.authservice.exception.OTPExpiredException;
import com.Microservice.authservice.repository.UserRepository;
import com.Microservice.authservice.service.AuthenticationService;

import com.Microservice.authservice.service.JwtService;
import com.Microservice.authservice.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final EmailVerificationService emailVerificationService;
    @Autowired
    private EmailService emailService;

    @Override
    public JwtAuthenticationResponse SignUp(SignUpRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

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
                .roles(assignedRoles)
                .isEnabled(true) // Enable by default, but require verification
                .isVerified(false) // Mark as unverified
                .verificationToken(UUID.randomUUID().toString())
                .verificationTokenExpiry(LocalDateTime.now().plusDays(1))
                .build();

        // Save user to the database
        userRepository.save(user);

        // Send verification email
        emailVerificationService.sendVerificationEmail(user);

        // Generate JWT & Refresh Token (with limited permissions for unverified users)
        var jwt = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user);

        return JwtAuthenticationResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken.getToken())
                .role(assignedRoles.toString())
                .userId(user.getId())
                .isVerified(false) // Indicate user is not verified yet
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

        // Check if user is verified
        if (!user.isVerified()) {
            throw new RuntimeException("Account not verified. Please check your email for verification link.");
        }

        // Check if account is enabled
        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled. Please contact administrator.");
        }

        // Generate JWT & Refresh Token
        var jwt = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user);

        return JwtAuthenticationResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken.getToken())
                .role(user.getRoles().toString())
                .userId(user.getId())
                .isVerified(user.isVerified())
                .build();
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    @Override
    public User updateUser(Integer id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(updatedUser.getName());
                    user.setEmail(updatedUser.getEmail());
                    user.setPhoneNumber(updatedUser.getPhoneNumber());
                    user.setAddress(updatedUser.getAddress());
                    user.setDateOfBirth(updatedUser.getDateOfBirth());
                    user.setRoles(updatedUser.getRoles());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    @Override
    public void deleteUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // First clear any refresh tokens to avoid constraint violations
        refreshTokenService.deleteByUser(user);

        // This will automatically delete refresh tokens due to cascade
        userRepository.delete(user);
    }


    @Override
    public ResponseEntity<Map<String, String>> sendForgotPasswordEmail(String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new OTPExpiredException("User not found"));

            String otp = generateOTP();
            user.setOtp(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
            userRepository.save(user);

            emailService.sendOtpEmail(email, otp);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "OTP sent successfully",
                    "email", email
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @Override
    public ResponseEntity<Map<String, String>> verifyOTP(String email, String otp) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new OTPExpiredException("User not found"));

            if (!otp.equals(user.getOtp())) {
                throw new OTPExpiredException("Invalid OTP");
            }

            if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
                throw new OTPExpiredException("OTP expired");
            }

            // Clear OTP after successful verification
            user.setOtp(null);
            user.setOtpExpiry(null);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "OTP verified",
                    "email", email
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @Override
    public ResponseEntity<Map<String, String>> resetPassword(ResetPasswordRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new OTPExpiredException("User not found"));

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Password reset successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    private String generateOTP() {
        return String.format("%06d", new Random().nextInt(999999));
    }



    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerified()) {
            throw new RuntimeException("Account is already verified");
        }

        // Generate new token and expiry
        String newToken = UUID.randomUUID().toString();
        user.setVerificationToken(newToken);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusDays(1));
        userRepository.save(user);

        // Resend email
        emailVerificationService.resendVerificationEmail(user);
    }

    @Override
    public void enableUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Override
    public void disableUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        user.setEnabled(false);
        userRepository.save(user);
    }

}
