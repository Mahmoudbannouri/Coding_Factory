package tn.esprit.reviews.reviews.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.reviews.reviews.DTO.entity.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCourseId(Long courseId);

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}