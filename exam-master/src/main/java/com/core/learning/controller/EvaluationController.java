package com.core.learning.controller;

import com.core.learning.model.Evaluation;
import com.core.learning.service.EvaluationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("evaluation")
public class EvaluationController {
    private final EvaluationService service;

    public EvaluationController(EvaluationService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<Evaluation> createEvaluation(@RequestBody Evaluation evaluation) {
        Evaluation createdEvaluation = service.createEvaluation(evaluation);
        return new ResponseEntity<>(createdEvaluation, HttpStatus.CREATED);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Evaluation> getEvaluationById(@PathVariable Long id) {
        Evaluation evaluation = service.getEvaluationById(id);
        return ResponseEntity.ok(evaluation);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEvaluation(@PathVariable Long id) {
        service.deleteEvaluation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/findAll")
    public ResponseEntity<List<Evaluation>> getAllEvaluation() {
        List<Evaluation> evaluations = service.getAllEvaluation();
        return ResponseEntity.ok(evaluations);
    }
}
