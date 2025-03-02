package tn.esprit.reviews.reviews.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.reviews.reviews.DTO.entity.Review;
import tn.esprit.reviews.reviews.clients.CourseServiceClient;
import tn.esprit.reviews.reviews.repositories.ReviewRepository;

import java.util.List;

@Service
public class ReviewServiceImpl implements tn.esprit.reviews.services.ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CourseServiceClient courseServiceClient;

    @Override
    public Review addReview(Review review) {
        // Save the review
        Review savedReview = reviewRepository.save(review);

        // Update the course's average rating
        updateCourseRate(savedReview.getCourseId());

        return savedReview;
    }

    @Override
    public List<Review> getReviewsByCourseId(Long courseId) {
        System.out.println("Fetching reviews for course ID: " + courseId);
        List<Review> reviews = reviewRepository.findByCourseId(courseId);
        System.out.println("Reviews found: " + reviews);
        return reviews;
    }
    @Override
    public double getAverageRatingByCourseId(Long courseId) {
        List<Review> reviews = reviewRepository.findByCourseId(courseId);
        if (reviews.isEmpty()) {
            return 0.0;
        }
        return reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
    }

    private void updateCourseRate(Long courseId) {
        // Calculate the new average rating
        double averageRating = getAverageRatingByCourseId(courseId);

        // Call the Course Microservice to update the course's rate
        courseServiceClient.updateCourseRate(courseId.intValue(), averageRating);
    }
}