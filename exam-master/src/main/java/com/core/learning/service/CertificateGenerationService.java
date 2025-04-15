package com.core.learning.service;


import com.core.learning.model.Certificate;
import com.core.learning.repository.CertificationReapository;
import com.core.learning.util.GenerateId;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfTemplate;
import com.itextpdf.text.pdf.PdfWriter;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Transactional
public class CertificateGenerationService {
    private static final Logger logger = LoggerFactory.getLogger(CertificateGenerationService.class);

    private final CertificationReapository certificationRepository;
    private final QRCodeService qrCodeService;
    private final SmsService smsService;

    @Value("${certificate.storage.path:certificates}")
    private String certificateStoragePath;
    
    @Value("${certificate.template.path:templates/template_certifcate.png}")
    private String certificateTemplatePath;
    
    @Value("${certificate.width:842}")  
    private float certificateWidth;
    
    @Value("${certificate.height:595}")
    private float certificateHeight;

    @Autowired
    public CertificateGenerationService(CertificationReapository repository, QRCodeService qrCodeService, SmsService smsService) {
        this.certificationRepository = repository;
        this.qrCodeService = qrCodeService;
        this.smsService = smsService;
    }

    public Certificate generateAndSaveCertificate(
        String id, Long userId, Long examId, String examTitle, String username, int score, int passPercentage) {
        try {
            byte[] certificateBytes = generateCertificatePdf(examId, examTitle, username, score, id, passPercentage);

            String certificatePath = saveCertificateToFile(certificateBytes, id, userId, examId);

            Certificate certification = Certificate.builder()
                .id(id)
                .userId(userId)
                .examId(examId)
                .examTitle(examTitle)
                .username(username)
                .score(score)
                .passPercentage(passPercentage)
                .certificatePath(certificatePath)
                .issuedDate(LocalDateTime.now())
                .isValid(score >= passPercentage)
                .build();

            return certificationRepository.save(certification);

        } catch (Exception e) {
            logger.error("Error generating and saving certificate", e);
            throw new RuntimeException("Failed to generate and save certificate", e);
        }
    }

    private byte[] generateCertificatePdf(Long examId, String examTitle, String username, int score, String id, int passPercentage) {
        Document document = new Document(new Rectangle(certificateWidth, certificateHeight));
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, byteArrayOutputStream);
            document.open();
            
            PdfContentByte canvas = writer.getDirectContentUnder();
            
            try {
                Path templatePath = Paths.get(certificateTemplatePath);
                if (Files.exists(templatePath)) {
                    Image backgroundImage = Image.getInstance(templatePath.toAbsolutePath().toString());
                    backgroundImage.setAbsolutePosition(0, 0);
                    backgroundImage.scaleToFit(certificateWidth, certificateHeight);
                    canvas.addImage(backgroundImage);
                } else {
                    canvas.setColorFill(new BaseColor(252, 252, 250));
                    canvas.rectangle(20, 20, certificateWidth - 40, certificateHeight - 40);
                    canvas.fill();
                    
                    canvas.setColorStroke(new BaseColor(44, 62, 80));
                    canvas.setLineWidth(3);
                    canvas.rectangle(25, 25, certificateWidth - 50, certificateHeight - 50);
                    canvas.stroke();
                }
            } catch (Exception e) {
                logger.warn("Could not load certificate template, using default style", e);
            }
            
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, BaseColor.DARK_GRAY);
            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, 
                    new Phrase("Certificate of Completion", titleFont),
                    certificateWidth / 2, certificateHeight - 150, 0);
            
            Font infoFont = FontFactory.getFont(FontFactory.HELVETICA, 16);
            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, 
                    new Phrase("This is to certify that", infoFont),
                    certificateWidth / 2, certificateHeight - 210, 0);
            
            Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, BaseColor.BLUE);
            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, 
                    new Phrase(username, nameFont),
                    certificateWidth / 2, certificateHeight - 250, 0);
            
            Font completionFont = FontFactory.getFont(FontFactory.HELVETICA, 16);
            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, 
                    new Phrase("has successfully completed the exam", completionFont),
                    certificateWidth / 2, certificateHeight - 280, 0);
            
            Font examFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, BaseColor.DARK_GRAY);
            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, 
                    new Phrase(examTitle, examFont),
                    certificateWidth / 2, certificateHeight - 310, 0);
            
            Font scoreFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new BaseColor(39, 174, 96));
            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, 
                    new Phrase(String.format("with a score of %d%%", score), scoreFont),
                    certificateWidth / 2, certificateHeight - 350, 0);
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
            String formattedDate = LocalDateTime.now().format(formatter);
            Font dateFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            ColumnText.showTextAligned(canvas, Element.ALIGN_LEFT, 
                    new Phrase("Issued on: " + formattedDate, dateFont),
                    80, 90, 0);
            
            Font idFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            ColumnText.showTextAligned(canvas, Element.ALIGN_RIGHT, 
                    new Phrase("Certificate ID: " + id, idFont),
                    certificateWidth - 80, 90, 0);
            
            try {
                byte[] qrCodeBytes = qrCodeService.generateQRCodeBytes(id, 100, 100);
                Image qrCodeImage = Image.getInstance(qrCodeBytes);
                
                qrCodeImage.setAbsolutePosition(certificateWidth - 170, 130);
                document.add(qrCodeImage);
                
                Font qrLabelFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
                ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, 
                        new Phrase("Scan to verify", qrLabelFont),
                        certificateWidth - 115, 120, 0);
            } catch (Exception e) {
                logger.error("Failed to add QR code to certificate", e);
            }
            
            Font signatureFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, 
                    new Phrase("______________________", signatureFont),
                    certificateWidth / 2, 170, 0);
            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, 
                    new Phrase("Authorized Signature", dateFont),
                    certificateWidth / 2, 150, 0);

            document.close();
            return byteArrayOutputStream.toByteArray();

        } catch (DocumentException e) {
            logger.error("Error generating PDF", e);
            throw new RuntimeException("Failed to generate certificate PDF", e);
        }
    }

    private String saveCertificateToFile(byte[] certificateBytes, String certificateId, Long userId, Long examId) {
        try {
            Path directoryPath = Paths.get(certificateStoragePath).toAbsolutePath();
            Files.createDirectories(directoryPath);

            String filename = String.format("certificate_%s.pdf", certificateId);
            Path filePath = directoryPath.resolve(filename);

            try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
                fos.write(certificateBytes);
            }

            logger.info("Certificate saved at: {}", filePath);
            return filePath.toString();

        } catch (IOException e) {
            logger.error("Error saving certificate file", e);
            throw new RuntimeException("Failed to save certificate file", e);
        }
    }

    public byte[] getCertificatePdfBytes(Long userId, Long examId, boolean sendEmail, String emailAddress) {
        try {
            Certificate certificate = certificationRepository.findByUserIdAndExamId(userId, examId)
                .orElseThrow(() -> new RuntimeException("Certificate not found for user " + userId + " and exam " + examId));
            
            Path certificatePath = Paths.get(certificate.getCertificatePath());
            
            byte[] certificateBytes;
            if (Files.exists(certificatePath)) {
                logger.info("Using existing certificate file: {}", certificatePath);
                certificateBytes = Files.readAllBytes(certificatePath);
            } else {
                logger.warn("Certificate file not found at: {}. Regenerating...", certificatePath);
                certificateBytes = generateCertificatePdf(
                    certificate.getExamId(), 
                    certificate.getExamTitle(), 
                    certificate.getUsername(), 
                    certificate.getScore(),
                    certificate.getId(),
                    certificate.getPassPercentage()
                );
                
                try (FileOutputStream fos = new FileOutputStream(certificatePath.toFile())) {
                    fos.write(certificateBytes);
                    logger.info("Regenerated certificate file saved at: {}", certificatePath);
                }
            }
            
            sendCertificateEmail(certificate, certificateBytes, emailAddress);
            
            return certificateBytes;
            
        } catch (IOException e) {
            logger.error("Error accessing certificate file", e);
            throw new RuntimeException("Failed to read or regenerate certificate file", e);
        }
    }
    
    public byte[] getCertificatePdfBytes(Long userId, Long examId, String email) {
        return getCertificatePdfBytes(userId, examId, false, email);
    }
    
    private void sendCertificateEmail(Certificate certificate, byte[] certificateBytes, String emailAddress) {
        try {
            String certificateName = String.format("certificate_%s.pdf", certificate.getId());
            
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
            
            smsService.sendCertificateByEmail(emailAddress, subject, body, certificateBytes, certificateName);
            logger.info("Certificate email sent to: {}", emailAddress);
        } catch (Exception e) {
            logger.error("Failed to send certificate email", e);
        }
    }

    public byte[] generateCertificatePdfBytes(Certificate certificate) {
        return generateCertificatePdf(
            certificate.getExamId(),
            certificate.getExamTitle(),
            certificate.getUsername(),
            certificate.getScore(),
            certificate.getId(),
            certificate.getPassPercentage()
        );
    }
}