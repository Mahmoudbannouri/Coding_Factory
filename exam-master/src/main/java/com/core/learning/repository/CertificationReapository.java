package com.core.learning.repository;

import com.core.learning.model.Certificate;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificationReapository extends JpaRepository<Certificate, String> {
    List<Certificate> findByUserId(Long userId);

    // Find certificate by user ID and exam ID
    Optional<Certificate> findByUserIdAndExamId(Long userId, Long examId);

    // Count valid certificates for a user
    Long countByUserIdAndIsValidTrue(Long userId);

    // Find all valid certificates
    List<Certificate> findByIsValidTrue();

    boolean existsByUserIdAndExamId(Long userId, Long examId);

}
