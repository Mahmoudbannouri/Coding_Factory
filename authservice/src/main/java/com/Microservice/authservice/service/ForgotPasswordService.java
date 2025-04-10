package com.Microservice.authservice.service;

public interface ForgotPasswordService {

    String forgotPassword(String email);
    String resetPassword(String token, String newPassword);
    String getGeneratedToken(String email);
}
