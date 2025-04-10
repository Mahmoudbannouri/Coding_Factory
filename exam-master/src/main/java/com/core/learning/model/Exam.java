package com.core.learning.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "exam")

public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // Exam title
    private String description; // Exam description
    private int chrono; // Time limit (e.g., in minutes)
    
    private int questionCount = 6; // Default: 6 questions per exam

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Quiz> quizzes;
    public void updateQuestionCount() {
        this.questionCount = (quizzes != null) ? quizzes.size() : 0;
    }

}