package tn.esprit.reviews.services;


import tn.esprit.reviews.reviews.DTO.entity.Review;

import java.util.List;

public interface ReviewService {
    Review addReview(Review review);
    List<Review> getReviewsByCourseId(Long courseId);
    double getAverageRatingByCourseId(Long courseId);
}