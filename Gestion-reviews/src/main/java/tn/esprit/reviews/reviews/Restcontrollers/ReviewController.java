package tn.esprit.reviews.reviews.Restcontrollers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.reviews.reviews.DTO.entity.Review;
import tn.esprit.reviews.reviews.Services.GeminiAIService;
import tn.esprit.reviews.reviews.Services.ReviewService;
import tn.esprit.reviews.reviews.repositories.ReviewRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private GeminiAIService geminiAIService;

    @PostMapping
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    @GetMapping("/course/{courseId}")
    public List<Review> getReviewsByCourseId(@PathVariable Long courseId) {
        System.out.println("Received request for reviews with course ID: " + courseId);
        List<Review> reviews = reviewService.getReviewsByCourseId(courseId);
        System.out.println("Returning reviews: " + reviews);
        return reviews;
    }

    @GetMapping("/course/{courseId}/average-rating")
    public ResponseEntity<Double> getAverageRatingByCourseId(@PathVariable Long courseId) {
        double averageRating = reviewService.getAverageRatingByCourseId(courseId);
        return ResponseEntity.ok(averageRating);
    }
    // In ReviewController.java
    // In ReviewController.java
    @GetMapping("/has-reviewed")
    public ResponseEntity<Boolean> hasStudentReviewed(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {

        boolean hasReviewed = reviewService.hasStudentReviewed(studentId, courseId);
        return ResponseEntity.ok(hasReviewed);
    }
    @DeleteMapping("/courses/{courseId}/recommendations")
    public ResponseEntity<Void> deleteRecommendation(@PathVariable Long courseId, @RequestParam String text) {
        reviewService.deleteRecommendation(courseId, text);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/courses/{courseId}/ai-recommendations")
    public ResponseEntity<Map<String, String>> getAIRecommendations(@PathVariable Long courseId) {
        String recommendations = reviewService.getAIRecommendationsForCourse(courseId);
        Map<String, String> response = new HashMap<>();
        response.put("recommendations", recommendations);
        return ResponseEntity.ok(response);
    }
}