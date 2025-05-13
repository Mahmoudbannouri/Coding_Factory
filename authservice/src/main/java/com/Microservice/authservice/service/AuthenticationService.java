package com.Microservice.authservice.service;


import com.Microservice.authservice.dao.request.ResetPasswordRequest;
import com.Microservice.authservice.dao.request.SignUpRequest;
import com.Microservice.authservice.dao.request.SingninRequest;
import com.Microservice.authservice.dao.request.response.JwtAuthenticationResponse;
import com.Microservice.authservice.entities.User;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface AuthenticationService {

    JwtAuthenticationResponse SignUp(SignUpRequest request);
    JwtAuthenticationResponse SignIn(SingninRequest request);
    List<User> getAllUsers();

    Optional<User> getUserById(Integer id);

    User updateUser(Integer id, User updatedUser);

    void deleteUser(Integer id);

    // Updated methods with proper return types
    ResponseEntity<Map<String, String>> sendForgotPasswordEmail(String email);
    ResponseEntity<Map<String, String>> verifyOTP(String email, String otp);
    ResponseEntity<Map<String, String>> resetPassword(ResetPasswordRequest request);

    void resendVerificationEmail(String email);

    void enableUser(Integer id);
    void disableUser(Integer id);



}
