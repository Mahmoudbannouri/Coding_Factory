package com.core.learning.service.impl;

import java.util.List;
import java.util.Optional;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.core.learning.DTO.MailResponse;
import com.core.learning.DTO.MailStatus;
import com.core.learning.model.Certificate;
import com.core.learning.repository.CertificationReapository;
import com.core.learning.service.CertificateGenerationService;
import com.core.learning.service.CertificationService;
import com.core.learning.service.SmsService;
import com.core.learning.util.GenerateId;

@Service
public class CertificateServiceImpl implements CertificationService {
    private final CertificationReapository certificateRepository;
    private final CertificateGenerationService certificateGenerationService;
    private final SmsService smsService;

    @Autowired
    public CertificateServiceImpl(CertificationReapository repository, 
                                CertificateGenerationService certificateGenerationService,
                                SmsService smsService) {
        this.certificateRepository = repository;
        this.certificateGenerationService = certificateGenerationService;
        this.smsService = smsService;
    }

    @Override
    public Certificate createCertificate(Long userId, Long examId, String username, 
                                         String examTitle, int score, int passPercentage) {
        Certificate certificate = Certificate.builder()
        .id(GenerateId.generateUniqueId())
            .userId(userId)
            .examId(examId)
            .username(username)
            .examTitle(examTitle)
            .score(score)
            .passPercentage(passPercentage)
            .build();

        certificate = certificateRepository.save(certificate);

        Certificate certificateBytes = certificateGenerationService.generateAndSaveCertificate(
            certificate.getId(), 
             userId,  examId,  examTitle,  username,  score,  passPercentage
        );

        certificate.setCertificatePath("certificates/certificate_" + certificate.getId() + ".pdf");
        certificate = certificateRepository.save(certificate);
        
        // After generating the certificate, automatically send it by email
        // Only send if certificate is valid (user passed the exam)
        if (score >= passPercentage) {
            try {
                // Attempt to send certificate by email
                // Assuming username is an email address
                if (username != null && username.contains("@")) {
                    MailResponse response = sendCertificateByEmail(userId, examId, username);
                    System.out.println("Certificate email status: " + response.getStatus() + " - " + response.getMessage());
                } else {
                    System.out.println("Cannot send certificate - username is not a valid email address: " + username);
                }
            } catch (Exception e) {
                System.err.println("Error sending certificate email: " + e.getMessage());
                // Continue even if email sending fails
            }
        }
        
        return certificate;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Certificate> getUserCertificates(Long userId) {
        return certificateRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Certificate> getCertificate(Long userId, Long examId,String email) {
        return certificateRepository.findByUserIdAndExamId(userId, examId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getValidCertificateCount(Long userId) {
        return certificateRepository.countByUserIdAndIsValidTrue(userId);
    }

    @Override
    public Certificate getCertificateById(String certificateId) {
        try {
            return certificateRepository.findById(certificateId).orElseThrow();
        } catch (Exception e) {
            System.out.println("Certificate not found");
            return null;
        }
    }

    @Override
    public boolean certificateExists(Long userId, Long examId) {
        return certificateRepository.existsByUserIdAndExamId(userId, examId);
    }

    @Override
    public MailResponse sendCertificateByEmail(Long userId, Long examId, String emailAddress) {
        try {
            // Check if certificate exists
            Optional<Certificate> certificateOpt = getCertificate(userId, examId,emailAddress);
            if (certificateOpt.isEmpty()) {
                return new MailResponse(MailStatus.FAILED, 
                    "Certificate not found for user " + userId + " and exam " + examId);
            }
            
            Certificate certificate = certificateOpt.get();
            
            // Get certificate PDF as bytes
            byte[] certificateBytes = certificateGenerationService.getCertificatePdfBytes(userId, examId,emailAddress);
            
            // Format the certificate filename
            String certificateName = String.format("certificate_%s.pdf", certificate.getId());
            
            // Format the email content
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
            String formattedDate = certificate.getIssuedDate().format(formatter);
            
            String subject = "Your Certificate for " + certificate.getExamTitle();
            
            String body = "Dear " + certificate.getUsername() + ",\n\n" +
                    "Congratulations on completing the " + certificate.getExamTitle() + " exam with a score of " + 
                    certificate.getScore() + "%!\n\n" +
                    "Please find your certificate attached to this email.\n\n" +
                    "Certificate Details:\n" +
                    "- Certificate ID: " + certificate.getId() + "\n" +
                    "- Issued Date: " + formattedDate + "\n\n" +
                    "Best regards,\nThe Certification Team";
            
            // Send email with certificate attachment
            return smsService.sendCertificateByEmail(emailAddress, subject, body, certificateBytes, certificateName);
            
        } catch (Exception e) {
            return new MailResponse(MailStatus.FAILED, 
                    "Failed to send certificate: " + e.getMessage());
        }
    }
}
