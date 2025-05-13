package com.partnershipmanagement.Controllers;

import com.partnershipmanagement.Services.EmailService;
import com.partnershipmanagement.Services.ZoomMeetingService;
import com.partnershipmanagement.Services.ZoomOAuthService;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/zoom")
public class ZoomController {

    private final ZoomOAuthService zoomOAuthService;
    private final ZoomMeetingService zoomMeetingService;
    private final EmailService emailService;

    public ZoomController(ZoomOAuthService zoomOAuthService, ZoomMeetingService zoomMeetingService, EmailService emailService) {
        this.zoomOAuthService = zoomOAuthService;
        this.zoomMeetingService = zoomMeetingService;
        this.emailService = emailService;
    }

    // Step 3: Create a meeting and send email invitation
    @PostMapping("/create-meeting")
    public ResponseEntity<String> createMeeting(
            @RequestParam String topic,
            @RequestParam String startTime,
            @RequestParam int duration,
            @RequestParam String accessToken,
            @RequestParam String recipientEmail
        ) throws MessagingException {  // Added anotherEmail

        // Create the Zoom meeting
        String meetingUrl = zoomMeetingService.createMeeting(topic, startTime, duration, accessToken);

        // Email details
        String emailSubject = "Zoom Meeting Invitation: " + topic;
        String emailBody = "You have been invited to a Zoom meeting.\n\n" +
                "Topic: " + topic + "\n" +
                "Start Time: " + startTime + "\n" +
                "Duration: " + duration + " minutes\n\n";

        // Send emails to both recipients
        emailService.sendEmail(recipientEmail, emailSubject, emailBody, meetingUrl);


        return ResponseEntity.ok("Meeting created successfully and invitations sent to: " + recipientEmail );
    }
}
