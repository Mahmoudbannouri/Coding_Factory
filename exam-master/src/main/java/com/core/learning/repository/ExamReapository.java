package com.core.learning.repository;

import com.core.learning.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamReapository extends JpaRepository<Exam, Long> {
}
