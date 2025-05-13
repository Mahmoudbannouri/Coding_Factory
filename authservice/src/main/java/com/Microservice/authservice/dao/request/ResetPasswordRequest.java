package com.Microservice.authservice.dao.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {

    private String email;
    private String newPassword;
}

