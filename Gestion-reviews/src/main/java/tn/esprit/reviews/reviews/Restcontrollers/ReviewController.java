package tn.esprit.reviews.reviews.Restcontrollers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.reviews.reviews.DTO.entity.Review;
import tn.esprit.reviews.services.ReviewService;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:4200") // Add this line
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

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


}