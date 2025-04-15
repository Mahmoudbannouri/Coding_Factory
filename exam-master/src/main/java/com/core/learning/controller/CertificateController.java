package com.core.learning.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.core.learning.model.Certificate;
import com.core.learning.service.CertificateGenerationService;
import com.core.learning.service.CertificationService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/certificates")
@RequiredArgsConstructor
@Tag(name = "Certificate Management", description = "APIs for managing and generating certificates")
public class CertificateController {

    private final CertificationService certificateService;
    private final CertificateGenerationService certificateGenerationService;

    @PostMapping("/generate")
    @Operation(summary = "Generate a new certificate", 
               description = "Creates a certificate for a user's exam completion")
    @ApiResponse(responseCode = "201", description = "Certificate successfully generated")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<Certificate> generateCertificate(
        @RequestParam @Parameter(description = "User ID") Long userId,
        @RequestParam @Parameter(description = "Exam ID") Long examId,
        @RequestParam @Parameter(description = "Username") String username,
        @RequestParam @Parameter(description = "Exam Title") String examTitle,
        @RequestParam @Parameter(description = "Score") int score,
        @RequestParam @Parameter(description = "Pass Percentage") int passPercentage
        
    ) {
        Certificate certificate = certificateService.createCertificate(
            userId, examId, username, examTitle, score, passPercentage
        );
        return new ResponseEntity<>(certificate, HttpStatus.CREATED);
    }
    @GetMapping("/download/{userId}/{examId}/{email}")
    @Operation(
        summary = "Download certificate PDF",
        description = "Retrieves the PDF certificate for a specific user and exam"
    )
    @ApiResponse(
        responseCode = "200", 
        description = "Certificate PDF downloaded successfully", 
        content = @Content(mediaType = "application/pdf")
    )
    @ApiResponse(responseCode = "404", description = "Certificate not found")
    @ApiResponse(responseCode = "500", description = "Error generating or retrieving certificate")
    public ResponseEntity<byte[]> downloadCertificate(
        @PathVariable @Parameter(description = "User ID") Long userId,
        @PathVariable @Parameter(description = "Exam ID") Long examId,
        @PathVariable @Parameter(description = "Email Address") String email
    ) {
        try {
            // Find the certificate
            Optional<Certificate> certificateOpt = certificateService.getCertificate(userId, examId, email);
            
            if (certificateOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Certificate certificate = certificateOpt.get();
            
            // Get PDF bytes - the service will regenerate if file is missing
            byte[] pdfBytes;
            try {
                pdfBytes = certificateGenerationService.getCertificatePdfBytes(userId, examId, email);
            } catch (Exception e) {
                // Fallback: Generate PDF directly without relying on stored file
                pdfBytes = certificateGenerationService.getCertificatePdfBytes(
                    userId, examId, email
                );
            }
            
            if (pdfBytes == null || pdfBytes.length == 0) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to generate certificate PDF");
            }
            
            // Create filename based on certificate details
            String filename = String.format("certificate_%s_%s.pdf", 
                             certificate.getId(), certificate.getUsername());
            
            // Set appropriate headers for file download
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
                
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Error processing certificate download: " + e.getMessage());
        }
    }
    // @GetMapping("/user/{userId}")
    // @Operation(summary = "Retrieve all certificates for a user", 
    //            description = "Fetches all certificates associated with a specific user")
    // public ResponseEntity<List<Certificate>> getUserCertificates(
    //     @PathVariable @Parameter(description = "User ID") Long userId
    // ) {
    //     List<Certificate> certificates = certificateService.getUserCertificates(userId);
    //     return ResponseEntity.ok(certificates);
    // }

    // @GetMapping("/download/{userId}/{examId}")
    // @Operation(summary = "Download certificate PDF", 
    //            description = "Retrieves the PDF certificate for a specific user and exam")
    // public ResponseEntity<byte[]> downloadCertificate(
    //     @PathVariable @Parameter(description = "User ID") Long userId,
    //     @PathVariable @Parameter(description = "Exam ID") Long examId
    // ) {
    //     // Find the certificate
    //     Optional<Certificate> certificateOpt = certificateService.getCertificate(userId, examId);
        
    //     if (certificateOpt.isEmpty()) {
    //         return ResponseEntity.notFound().build();
    //     }
        
    //     Certificate certificate = certificateOpt.get();
        
    //     // Generate PDF
    //     byte[] pdfBytes = certificateGenerationService.generateCertificate(
    //         certificate.getId(), 
    //         userId, 
    //         certificate.getUsername(), 
    //         certificate.getExamTitle(), 
    //         certificate.getScore()
    //     );

    //     // Prepare response
    //     return ResponseEntity.ok()
    //         .contentType(MediaType.APPLICATION_PDF)
    //         .header(HttpHeaders.CONTENT_DISPOSITION, 
    //                 "attachment; filename=certificate_" + userId + "_" + examId + ".pdf")
    //         .body(pdfBytes);
    // }

    // @GetMapping("/valid-count/{userId}")
    // @Operation(summary = "Get valid certificate count", 
    //            description = "Retrieves the number of valid certificates for a user")
    // public ResponseEntity<Long> getValidCertificateCount(
    //     @PathVariable @Parameter(description = "User ID") Long userId
    // ) {
    //     Long validCount = certificateService.getValidCertificateCount(userId);
    //     return ResponseEntity.ok(validCount);
    // }

    // @GetMapping("/{userId}/{examId}")
    // @Operation(summary = "Get specific certificate", 
    //            description = "Retrieves a certificate for a specific user and exam")
    // public ResponseEntity<Certificate> getCertificate(
    //     @PathVariable @Parameter(description = "User ID") Long userId,
    //     @PathVariable @Parameter(description = "Exam ID") Long examId
    // ) {
    //     Optional<Certificate> certificate = certificateService.getCertificate(userId, examId);
    //     return certificate
    //         .map(ResponseEntity::ok)
    //         .orElse(ResponseEntity.notFound().build());
    // }
}