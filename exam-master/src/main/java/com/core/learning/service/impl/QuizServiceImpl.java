package com.core.learning.service.impl;

import com.core.learning.DTO.QuizDTO;
import com.core.learning.model.Exam;
import com.core.learning.model.Quiz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.core.learning.repository.ExamReapository;
import com.core.learning.repository.QuizRepository;
import com.core.learning.service.CertificationService;
import com.core.learning.service.QuizService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizServiceImpl implements QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private ExamReapository examRepository;

    @Override
    public List<QuizDTO> getAllQuizzes() {
        return quizRepository.findAll().stream()
        .map(quiz -> new QuizDTO(quiz)) // Pass the entire entity
        .collect(Collectors.toList());
    }

    @Override
    public Optional<Quiz> getQuizById(Long id) {
        return quizRepository.findById(id);
    }

    @Override
    public Quiz addQuiz(Long examId, Quiz quiz) {
        return examRepository.findById(examId).map(exam -> {
            quiz.setExam(exam);
            Quiz savedQuiz = quizRepository.save(quiz);

            //  Update the number of questions in the exam
            exam.getQuizzes().add(savedQuiz);
            exam.updateQuestionCount();
            examRepository.save(exam);

            return savedQuiz;
        }).orElseThrow(() -> new RuntimeException("Exam not found"));
    }

    @Override
    public Quiz updateQuiz(Long id, Quiz updatedQuiz) {
        return quizRepository.findById(id).map(quiz -> {
            quiz.setQuestion(updatedQuiz.getQuestion());
            quiz.setOptionA(updatedQuiz.getOptionA());
            quiz.setOptionB(updatedQuiz.getOptionB());
            quiz.setOptionC(updatedQuiz.getOptionC());
            quiz.setOptionD(updatedQuiz.getOptionD());
            quiz.setCorrectOption(updatedQuiz.getCorrectOption());
            return quizRepository.save(quiz);
        }).orElseThrow(() -> new RuntimeException("Quiz not found"));
    }

    @Override
    public void deleteQuiz(Long id) {
        quizRepository.findById(id).ifPresent(quiz -> {
            Exam exam = quiz.getExam();
            quizRepository.delete(quiz);

            exam.getQuizzes().remove(quiz);
            exam.updateQuestionCount();
            examRepository.save(exam);
        });
    }

    @Override
    public List<QuizDTO> getQuizzesByExamId(Long examId) {
        return quizRepository.findByExamId(examId).stream()
                .map(quiz -> new QuizDTO(quiz))
                .collect(Collectors.toList());
    }
    
    
    }
