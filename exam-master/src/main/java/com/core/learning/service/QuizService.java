package com.core.learning.service;


import java.util.List;
import java.util.Optional;

import com.core.learning.DTO.QuizDTO;
import com.core.learning.model.Quiz;

public interface QuizService {
    List<QuizDTO> getAllQuizzes();
    Optional<Quiz> getQuizById(Long id);
    Quiz addQuiz(Long examId, Quiz quiz);
    Quiz updateQuiz(Long id, Quiz updatedQuiz);
    void deleteQuiz(Long id);
    List<QuizDTO> getQuizzesByExamId(Long examId);

}