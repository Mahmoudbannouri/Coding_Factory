// package com.core.learning.service;

// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import com.core.learning.model.Certificate;
// import com.core.learning.repository.CertificationReapository;

// import java.util.List;
// import java.util.Optional;

// public class CertificateService {
//     private final CertificationReapository certificateRepository;
//     private final CertificateGenerationService certificateGenerationService;


//     @Transactional
//     public Certificate createCertificate(Long userId, Long examId, String username, 
//                                          String examTitle, Integer score, Integer passPercentage) {
//         // Create certificate entity
//         Certificate certificate = Certificate.builder()
//             .userId(userId)
//             .examId(examId)
//             .username(username)
//             .examTitle(examTitle)
//             .score(score)
//             .passPercentage(passPercentage)
//             .build();

//         // Save certificate to database
//         certificate = certificateRepository.save(certificate);

//         // Generate PDF certificate
//         Certificate certificateBytes = certificateGenerationService.generateAndSaveCertificate(
//             certificate.getId(), 
//             userId, 
//             examId, 
//             username, 
//             examTitle, 
//             score,
//             passPercentage
//         );

//         // Save certificate file path (optional)
//         certificate.setCertificatePath("certificates/certificate_" + certificate.getId() + ".pdf");
//         return certificateRepository.save(certificate);
//     }

//     @Transactional(readOnly = true)
//     public List<Certificate> getUserCertificates(Long userId) {
//         return certificateRepository.findByUserId(userId);
//     }

//     @Transactional(readOnly = true)
//     public Optional<Certificate> getCertificate(Long userId, Long examId) {
//         return certificateRepository.findByUserIdAndExamId(userId, examId);
//     }

//     @Transactional(readOnly = true)
//     public Long getValidCertificateCount(Long userId) {
//         return certificateRepository.countByUserIdAndIsValidTrue(userId);
//     }

// }
