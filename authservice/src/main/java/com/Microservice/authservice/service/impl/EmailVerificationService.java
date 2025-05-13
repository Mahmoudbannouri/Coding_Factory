package com.Microservice.authservice.service.impl;

import com.Microservice.authservice.entities.User;
import com.Microservice.authservice.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailVerificationService {
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    @Value("${app.verification-url}")
    private String verificationUrl;

    public void sendVerificationEmail(User user) {
        String token = generateVerificationToken();
        user.setVerificationToken(token);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusDays(1)); // 24 hours expiry
        userRepository.save(user);

        String verificationLink = verificationUrl + "?token=" + token;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(user.getEmail());
            helper.setSubject("Account Verification");

            // HTML email content
            String emailContent = "<html><body>"
                    + "<h2>Welcome to Our Service!</h2>"
                    + "<p>Please click the following link to verify your account:</p>"
                    + "<a href=\"" + verificationLink + "\">Verify Account</a>"
                    + "<p>Or copy this URL to your browser:<br>"
                    + verificationLink + "</p>"
                    + "</body></html>";

            helper.setText(emailContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    private String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }


    @Transactional
    public boolean verifyUser(String token) {
        log.info("Attempting to verify token: {}", token);

        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> {
                    log.error("Verification failed: Invalid token {}", token);
                    return new RuntimeException("Invalid verification token");
                });

        if (user.getVerificationTokenExpiry() == null) {
            log.error("Verification failed: No expiry date for token {}", token);
            throw new RuntimeException("Invalid verification token");
        }

        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            log.error("Verification failed: Expired token for user {}", user.getEmail());
            throw new RuntimeException("Verification link has expired");
        }

        if (user.isVerified()) {
            log.warn("User {} already verified", user.getEmail());
            throw new RuntimeException("Account is already verified");
        }

        log.info("Verifying user {}", user.getEmail());
        user.setVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);

        log.info("Successfully verified user {}", user.getEmail());
        return true;
    }

    public void resendVerificationEmail(User user) {
        String verificationLink = verificationUrl + "?token=" + user.getVerificationToken();

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(user.getEmail());
            helper.setSubject("Account Verification - New Link");

            // HTML email content
            String emailContent = "<html><body>"
                    + "<h2>New Verification Link</h2>"
                    + "<p>Here's your new verification link:</p>"
                    + "<a href=\"" + verificationLink + "\">Verify Account</a>"
                    + "<p>Or copy this URL to your browser:<br>"
                    + verificationLink + "</p>"
                    + "<p>This link will expire in 24 hours.</p>"
                    + "</body></html>";

            helper.setText(emailContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to resend verification email", e);
        }
    }
}