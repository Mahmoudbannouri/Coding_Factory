package com.core.learning.service.impl;

import com.core.learning.model.Evaluation;
import com.core.learning.repository.EvaluationReapository;
import com.core.learning.service.EvaluationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EvaluationServiceImpl implements EvaluationService {
    private final EvaluationReapository repository;

    public EvaluationServiceImpl(EvaluationReapository repository) {
        this.repository = repository;
    }

    @Override
    public Evaluation createEvaluation(Evaluation evaluation) {
        return repository.save(evaluation);
    }

    @Override
    public Evaluation getEvaluationById(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Evaluation not found with id: " + id));
    }

    @Override
    public void deleteEvaluation(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Cannot delete. Evaluation not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public List<Evaluation> getAllEvaluation() {
        return repository.findAll();
    }
}
