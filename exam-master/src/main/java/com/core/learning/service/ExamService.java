package com.core.learning.service;

import com.core.learning.DTO.ExamsDTO;
import com.core.learning.model.Exam;

import java.util.List;
import java.util.Optional;

public interface ExamService {
    List<ExamsDTO> getAllExams();
    Optional<Exam> getExamById(Long id);
    Exam addExam(Exam exam);
    Exam updateExam(Long id, Exam updatedExam);
    void deleteExam(Long id);
    void completeExam(Long examId, Long userId, List<String> selectedAnswers, String username, String examTitle) ;
    
}
