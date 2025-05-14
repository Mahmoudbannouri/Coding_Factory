package com.partnershipmanagement.Services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    //gmail integration
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body, String zoomLink) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);

        String htmlContent = """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
                <h2 style="margin: 0; color: #4B0082;">Partnership Invitation</h2>
            </div>
            <div style="padding: 20px;">
                <p>Dear Partner,</p>
                <p>%s</p>

                <p><strong>Zoom Meeting Link:</strong><br>
                <a href="%s" style="color: #4B0082;">%s</a></p>

                <p>We look forward to collaborating with you!</p>
            </div>
            <div style="background-color: #4B0082; color: white; padding: 20px;">
                <h3 style="margin: 0;">Company Contact</h3>
                <p style="margin: 5px 0;">Rabie Zerrim – Partnership Manager</p>
                <p style="margin: 5px 0;">📞 (+216) 50 456 890 | ✉️ contact@ourcompany.com</p>
                <p style="margin: 5px 0;">🏢 123 Innovation St., Tech City</p>
                <div style="margin-top: 10px;">
                    <a href="https://linkedin.com" style="margin-right: 10px; color: white;">LinkedIn</a>
                    <a href="https://twitter.com" style="margin-right: 10px; color: white;">Twitter</a>
                    <a href="https://facebook.com" style="color: white;">Facebook</a>
                </div>
            </div>
        </div>
        """.formatted(body, zoomLink, zoomLink);

        helper.setText(htmlContent, true); // 'true' to enable HTML

        mailSender.send(message);
    }

}
