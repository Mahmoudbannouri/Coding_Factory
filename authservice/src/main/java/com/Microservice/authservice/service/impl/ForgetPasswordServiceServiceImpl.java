package com.Microservice.authservice.service.impl;


import com.Microservice.authservice.entities.User;
import com.Microservice.authservice.repository.UserRepository;

import com.Microservice.authservice.service.EmailService;
import com.Microservice.authservice.service.ForgotPasswordService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ForgetPasswordServiceServiceImpl implements ForgotPasswordService {

    @Value("${server.port}")
    private String serverPort;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;


    @Override
    public String forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("Email not found");
        }
        User user = userOptional.get();

        //Generate a password reset token
        String generatedToken = UUID.randomUUID().toString();
        user.setResetToken(generatedToken);

        log.info("Generated rest token for email {}:{}", email, generatedToken);

        userRepository.save(user);

        String resetUrl = "http://localhost:" + serverPort + "/api/v1/auth/reset-password?token=" + generatedToken;

        userRepository.save(user);

        emailService.sendEmail(
                email,
                "Password Reset Request",
                "To reset your password click the link" + resetUrl);

        return "Password reset email sent !";
    }

    @Override
    public String resetPassword(String token, String newPassword) {
        Optional<User> userOptional = userRepository.findByResetToken(token);
        if(!userOptional.isPresent()){
            throw new IllegalArgumentException("Invalid token");
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        userRepository.save(user);

        return "Password has been reset successfully!";
    }

    @Override
    public String getGeneratedToken(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent()){
            return userOptional.get().getResetToken();
        }
        return null;
    }
}
