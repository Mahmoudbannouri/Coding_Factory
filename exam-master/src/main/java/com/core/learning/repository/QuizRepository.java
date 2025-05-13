package com.core.learning.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.core.learning.model.Quiz;





@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByExamId(Long examId);

}
