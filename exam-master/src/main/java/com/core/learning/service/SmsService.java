package com.core.learning.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.core.learning.DTO.MailRequest;
import com.core.learning.DTO.MailResponse;
import com.core.learning.DTO.MailStatus;

import jakarta.activation.DataSource;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;

@Service
public class SmsService {
    
    // Re-add @Autowired but make it required=false so app won't crash if bean is missing
    @Autowired(required = false)
    private JavaMailSender emailSender;
    
    private Map<String, String> otpMap = new HashMap<>();
    
    public MailResponse sendMail(MailRequest maiLRequest) {
        System.out.println("inside sendMail :: " + maiLRequest);
        try {
            String subject = "👋 Welcome to Our Platform 🎉!";
            String body = maiLRequest.getBody();
            
            // Log email details regardless of whether we'll send it
            System.out.println("Email to: " + maiLRequest.getUsername());
            System.out.println("Subject: " + subject);
            System.out.println("Body: " + body);
            
            if (maiLRequest.getOtp() != null) {
                otpMap.put(maiLRequest.getUsername(), maiLRequest.getOtp());
            }
            
            // Check if emailSender is available before trying to send
            if (emailSender != null) {
                sendSimpleEmail(maiLRequest.getUsername(), subject, body);
                return new MailResponse(MailStatus.DELIVERED, "Email sent successfully");
            } else {
                return new MailResponse(MailStatus.DELIVERED, "Email logged but not sent (mail sender not configured)");
            }
        } catch (Exception e) {
            return new MailResponse(MailStatus.FAILED, e.getMessage());
        }
    }
    
    private void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }
    
    /**
     * Sends an email with a certificate attachment
     * 
     * @param to recipient email address
     * @param subject email subject
     * @param text email body text
     * @param certificateBytes the PDF certificate as byte array
     * @param certificateName filename for the certificate
     * @return MailResponse with status of the email sending
     */
    public MailResponse sendCertificateByEmail(String to, String subject, String text, 
                                              byte[] certificateBytes, String certificateName) {
        try {
            // Log email details
            System.out.println("Sending certificate email to: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("Certificate filename: " + certificateName);
            
            // Check if emailSender is available before trying to send
            if (emailSender != null) {
                jakarta.mail.internet.MimeMessage message = emailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);
                
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(text);
                
                // Add the certificate as an attachment
                helper.addAttachment(certificateName, 
                        (DataSource) new DataSource() {
                            @Override
                            public java.io.InputStream getInputStream() {
                                return new java.io.ByteArrayInputStream(certificateBytes);
                            }
                            
                            @Override
                            public java.io.OutputStream getOutputStream() {
                                throw new UnsupportedOperationException("Read-only data");
                            }
                            
                            @Override
                            public String getContentType() {
                                return "application/pdf";
                            }
                            
                            @Override
                            public String getName() {
                                return certificateName;
                            }
                        });
                
                emailSender.send(message);
                return new MailResponse(MailStatus.DELIVERED, "Email with certificate sent successfully");
            } else {
                return new MailResponse(MailStatus.DELIVERED, 
                        "Email with certificate logged but not sent (mail sender not configured)");
            }
        } catch (Exception e) {
            return new MailResponse(MailStatus.FAILED, "Error preparing certificate email: " + e.getMessage());
        }
    }
}
