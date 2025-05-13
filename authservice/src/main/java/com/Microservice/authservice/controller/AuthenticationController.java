package com.Microservice.authservice.controller;


import com.Microservice.authservice.dao.request.*;
import com.Microservice.authservice.dao.request.response.JwtAuthenticationResponse;
import com.Microservice.authservice.entities.RefreshToken;
import com.Microservice.authservice.entities.Role;
import com.Microservice.authservice.entities.User;
import com.Microservice.authservice.exception.OTPExpiredException;
import com.Microservice.authservice.exception.TokenRefreshException;
import com.Microservice.authservice.repository.UserRepository;
import com.Microservice.authservice.service.AuthenticationService;
import com.Microservice.authservice.service.RefreshTokenService;
import com.Microservice.authservice.service.impl.EmailVerificationService;
import com.Microservice.authservice.service.impl.JwtServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final RefreshTokenService refreshTokenService;

    private final JwtServiceImpl jwtService;

    private final EmailVerificationService emailVerificationService;

    private final UserRepository userRepository;

    @Value("${app.verification-url}")
    private String verificationUrl;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @PostMapping("/signup")
    public ResponseEntity<JwtAuthenticationResponse> signup(@RequestBody SignUpRequest request) {
        return ResponseEntity.ok(authenticationService.SignUp(request));
    }

    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody SingninRequest request, HttpServletResponse response) {
        JwtAuthenticationResponse jwtResponse = authenticationService.SignIn(request);

        if (jwtResponse != null && jwtResponse.getToken() != null) {
            // Set the token in the response header
            response.setHeader("Access-Control-Expose-Headers", "Authorization");
            response.setHeader("Access-Control-Allow-Headers", "Authorization, X-Pingother, Origin, X-Requested-with, Content-Type, Accept, X-Custom-header");
            response.setHeader("Authorization", "Bearer " + jwtResponse.getToken());
            // Return a response with user details in the body
            JSONObject responseBody = new JSONObject();
            responseBody.put("userID", jwtResponse.getUserId());
            responseBody.put("role", jwtResponse.getRole());
            return ResponseEntity.ok(jwtResponse);
        } else {
            return ResponseEntity.badRequest().body(jwtResponse); // Assuming jwtResponse can be null
        }
    }


    @PostMapping("/refresh-token")
    public ResponseEntity<JwtAuthenticationResponse> refreshToken(@RequestBody Map<String,String> request){
        String refreshToken = request.get("refreshToken");
        RefreshToken token = refreshTokenService.findByToken(refreshToken).orElseThrow(
                () -> new TokenRefreshException(refreshToken,"Refresh token not found")
        );

        String newToken = jwtService.generateToken(token.getUser());

        return ResponseEntity.ok(JwtAuthenticationResponse.builder().token(newToken).refreshToken(refreshToken).build());
    }

    @GetMapping("/verify")
    public void verifyAccount(
            @RequestParam String token,
            HttpServletResponse response) throws IOException {

        try {
            User user = userRepository.findByVerificationToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid verification token"));

            if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification link has expired");
            }

            user.setVerified(true);
            user.setVerificationToken(null);
            user.setVerificationTokenExpiry(null);
            userRepository.save(user);

            // Redirect to frontend LOGIN page (not error page)
            String redirectUrl = "http://localhost:4200/pages/login" +  // Changed from /pages/error to /pages/login
                    "?verified=true" +
                    "&email=" + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8) +
                    "&message=Account verified successfully!";

            response.sendRedirect(redirectUrl);

        } catch (RuntimeException e) {
            // Redirect to frontend LOGIN page with error status
            String redirectUrl = "http://localhost:4200/pages/login" +  // Changed from /pages/error to /pages/login
                    "?verified=false" +
                    "&error=" + URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);

            response.sendRedirect(redirectUrl);
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail(@RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

            if (user.isVerified()) {
                return ResponseEntity.badRequest().body("Account is already verified");
            }

            // Generate new token and expiry
            String newToken = UUID.randomUUID().toString();
            user.setVerificationToken(newToken);
            user.setVerificationTokenExpiry(LocalDateTime.now().plusDays(1));
            userRepository.save(user);

            // Resend email
            String verificationLink = verificationUrl + "?token=" + newToken;
            emailVerificationService.sendVerificationEmail(user);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Verification email resent successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to resend verification email: " + e.getMessage()
                    ));
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(authenticationService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        Optional<User> user = authenticationService.getUserById(id);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User updatedUser) {
        return ResponseEntity.ok(authenticationService.updateUser(id, updatedUser));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        authenticationService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return authenticationService.sendForgotPasswordEmail(request.getEmail());
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOTP(@RequestBody OtpVerificationRequest request) {
        return authenticationService.verifyOTP(request.getEmail(), request.getOtp());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        return authenticationService.resetPassword(request);
    }
    @PostMapping("/users/{id}/enable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> enableUser(@PathVariable Integer id) {
        authenticationService.enableUser(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{id}/disable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> disableUser(@PathVariable Integer id) {
        authenticationService.disableUser(id);
        return ResponseEntity.ok().build();
    }




}