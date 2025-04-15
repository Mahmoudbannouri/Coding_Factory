package com.core.learning.repository;

import com.core.learning.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationReapository extends JpaRepository<Evaluation, Long> {
}
