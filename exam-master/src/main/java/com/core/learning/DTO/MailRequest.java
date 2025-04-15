package com.core.learning.DTO;

public class MailRequest {
    private String username;
    private String otp;
    private String body;
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    
    @Override
    public String toString() {
        return "maiLRequest{username='" + username + "', otp='" + otp + "', body='" + body + "'}";
    }
}

