package com.PIDEV.Auth.Service.Dto;


import lombok.Data;

@Data
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private long expiresIn;
}

