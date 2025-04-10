package com.core.learning.DTO;

import lombok.Getter;
import lombok.Setter;

import com.core.learning.model.Quiz;

import lombok.Data;

@Data
@Getter
@Setter
public class QuizDTO {
    private Long id;
    private String question;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctOption;
    private Long examId;

    // Constructor to initialize from Quiz entity
    public QuizDTO(Quiz quiz) {
        this.id = quiz.getId();
        this.question = quiz.getQuestion();
        this.optionA = quiz.getOptionA();
        this.optionB = quiz.getOptionB();
        this.optionC = quiz.getOptionC();
        this.optionD = quiz.getOptionD();
        this.correctOption = quiz.getCorrectOption();
        this.examId = quiz.getExam().getId();
    }

    // Existing constructors, getters, and setters
}