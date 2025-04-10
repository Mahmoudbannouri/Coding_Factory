package com.core.learning.service;

import java.util.List;
import java.util.Optional;

import com.core.learning.DTO.MailResponse;
import com.core.learning.model.Certificate;

public interface CertificationService {
    Certificate createCertificate(Long userId, Long examId, String username, String examTitle, int score, int passPercentage);
    Long getValidCertificateCount(Long userId);
    Optional<Certificate> getCertificate(Long userId, Long examId,String email);
    List<Certificate> getUserCertificates(Long userId);
    Certificate getCertificateById(String certificateId);
    boolean certificateExists(Long userId, Long examId);
    MailResponse sendCertificateByEmail(Long userId, Long examId, String emailAddress);
}
