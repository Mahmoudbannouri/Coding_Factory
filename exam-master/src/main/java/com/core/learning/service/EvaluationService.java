package com.core.learning.service;

import com.core.learning.model.Evaluation;

import java.util.List;

public interface EvaluationService {
    Evaluation createEvaluation(Evaluation evaluation);

    Evaluation getEvaluationById(Long id);

    void deleteEvaluation(Long id);

    List<Evaluation> getAllEvaluation();
}
