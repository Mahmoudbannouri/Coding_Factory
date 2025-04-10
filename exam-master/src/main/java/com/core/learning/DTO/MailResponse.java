package com.core.learning.DTO;


public class MailResponse {
    private MailStatus status;
    private String message;
    
    public MailResponse(MailStatus status, String message) {
        this.status = status;
        this.message = message;
    }
    
    public MailStatus getStatus() { return status; }
    public void setStatus(MailStatus status) { this.status = status; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}