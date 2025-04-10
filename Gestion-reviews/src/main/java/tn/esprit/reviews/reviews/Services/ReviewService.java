package tn.esprit.reviews.reviews.Services;


import tn.esprit.reviews.reviews.DTO.entity.Review;

import java.util.List;

public interface ReviewService {
    Review addReview(Review review);

    // In ReviewServiceImpl.java
    boolean hasStudentReviewed(Long studentId, Long courseId);

    List<Review> getReviewsByCourseId(Long courseId);
    double getAverageRatingByCourseId(Long courseId);

    String getAIRecommendationsForCourse(Long courseId);

    void deleteRecommendation(Long courseId, String text);
}