package com.Microservice.authservice.dao.request;

import lombok.Data;

@Data
public class OtpVerificationRequest {

    private String email;
    private String otp;
}
