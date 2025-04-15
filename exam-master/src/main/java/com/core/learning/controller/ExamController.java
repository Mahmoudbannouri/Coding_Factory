package com.core.learning.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.core.learning.DTO.ExamsDTO;
import com.core.learning.DTO.QuizDTO;
import com.core.learning.model.Exam;
import com.core.learning.service.ExamService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

    @GetMapping
    public List<ExamsDTO> getAllExams() {
        return examService.getAllExams();
    }

    @GetMapping("/{id}")
    public Optional<Exam> getExamById(@PathVariable Long id) {
        return examService.getExamById(id);
    }

    @PostMapping
    public Exam createExam(@RequestBody Exam exam) {
        return examService.addExam(exam);
    }

    @PutMapping("/{id}")
    public Exam updateExam(@PathVariable Long id, @RequestBody Exam updatedExam) {
        return examService.updateExam(id, updatedExam);
    }

    @DeleteMapping("/{id}")
    public void deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
    }
    @PostMapping("/complete")
    public String completeExam(
            @RequestParam Long examId,
            @RequestParam Long userId,
            @RequestParam String username,
            @RequestParam String examTitle,
            @RequestBody List<String> selectedAnswers) {
        
        try {
            // Call the service method with all parameters in the correct order
            examService.completeExam(examId, userId, selectedAnswers, username, examTitle);
            return "Exam completed successfully!";
        } catch (Exception e) {
            // Handle any errors that occur during exam completion
            return "Error completing the exam: " + e.getMessage();
        }
    }
}
