package com.core.learning.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "certificates")
public class Certificate {
    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "exam_id", nullable = false)
    private Long examId;

    @Column(name = "exam_title", nullable = false, length = 255)
    private String examTitle;

    @Column(name = "username", nullable = false, length = 100)
    private String username;

    @Column(name = "score", nullable = false)
    private Integer score;

    @Column(name = "pass_percentage", nullable = false)
    private Integer passPercentage;

    @Column(name = "certificate_path", length = 500)
    private String certificatePath;

    @Column(name = "issued_date", nullable = false)
    private LocalDateTime issuedDate;

    @Column(name = "is_valid", nullable = false)
    private Boolean isValid;

    @PrePersist
    protected void onCreate() {
        this.issuedDate = LocalDateTime.now();
        this.isValid = this.score != null && this.passPercentage != null 
                       && this.score >= this.passPercentage;
    }

    // Additional method to check certificate validity
    public boolean isPassedExam() {
        return this.score != null && this.passPercentage != null 
               && this.score >= this.passPercentage;
    }
}