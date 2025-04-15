package com.core.learning.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.core.learning.DTO.MailRequest;
import com.core.learning.DTO.MailResponse;
import com.core.learning.DTO.MailStatus;
import com.core.learning.service.SmsService;

@RestController
@RequestMapping("/api/communication")
public class SmsController {
    
    @Autowired
    private SmsService smsService;
    
    @PostMapping("/send-email")
    public ResponseEntity<MailResponse> sendEmail(@RequestBody MailRequest request) {
        MailResponse response = smsService.sendMail(request);
        HttpStatus status = response.getStatus() == MailStatus.DELIVERED ? 
                            HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR;
        return new ResponseEntity<>(response, status);
    }
}
