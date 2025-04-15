package com.core.learning.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
 @Setter
public class ExamsDTO {
    private Long id;
    private String title;
    private String description;
    private int chrono;
    private int questionCount;
    private List<QuizDTO> quizzes;

    // Lombok @Data annotation will generate getters and setters
}
