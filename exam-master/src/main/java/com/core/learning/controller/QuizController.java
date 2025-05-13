package com.core.learning.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.core.learning.DTO.QuizDTO;
import com.core.learning.model.Quiz;
import com.core.learning.service.QuizService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping
    public List<QuizDTO> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @GetMapping("/{id}")
    public Optional<Quiz> getQuizById(@PathVariable Long id) {
        return quizService.getQuizById(id);
    }

    @PostMapping("/quiz/{quizId}")
    public Quiz createQuiz(@PathVariable Long quizId, @RequestBody Quiz quiz) {
        return quizService.addQuiz(quizId, quiz);
    }

    @PutMapping("/{id}")
    public Quiz updateQuiz(@PathVariable Long id, @RequestBody Quiz updatedQuiz) {
        return quizService.updateQuiz(id, updatedQuiz);
    }

    @DeleteMapping("/{id}")
    public void deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
    }

    @GetMapping("/quiz/{quizId}")
    public List<QuizDTO> getQuizzesByExamId(@PathVariable Long quizId) {
        return quizService.getQuizzesByExamId(quizId);
    }
}
