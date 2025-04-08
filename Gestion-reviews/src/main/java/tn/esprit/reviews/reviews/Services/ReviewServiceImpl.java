package tn.esprit.reviews.reviews.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.reviews.reviews.DTO.entity.Recommendation;
import tn.esprit.reviews.reviews.DTO.entity.Review;
import tn.esprit.reviews.reviews.DTO.entity.SentimentAnalysisResult;
import tn.esprit.reviews.reviews.clients.CourseServiceClient;
import tn.esprit.reviews.reviews.repositories.ReviewRepository;
import tn.esprit.reviews.reviews.repositories.recommendationRepository;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private recommendationRepository rec;

    @Autowired
    private CourseServiceClient courseServiceClient;

    @Autowired
    private GeminiAIService geminiAIService;

    // In ReviewServiceImpl.java
    @Override
    public Review addReview(Review review) {
        // First check if the student has already reviewed this course
        if (reviewRepository.existsByStudentIdAndCourseId(review.getStudentId(), review.getCourseId())) {
            throw new IllegalStateException("You have already reviewed this course");
        }

        // Rest of your existing addReview logic
        if (review.getComment() == null || review.getComment().trim().isEmpty()) {
            Review savedReview = reviewRepository.save(review);
            updateCourseRate(review.getCourseId());
            return savedReview;
        }

        SentimentAnalysisResult result = geminiAIService.analyzeSentiment(review.getComment());
        Review savedReview = reviewRepository.save(review);

        String aiRecommendations = result.getSuggestion();
        Recommendation recommendation = new Recommendation();
        recommendation.setRecommendation(aiRecommendations);
        recommendation.setReview(savedReview);
        rec.save(recommendation);

        updateCourseRate(review.getCourseId());
        return savedReview;
    }
    // In ReviewServiceImpl.java
    @Override
    public boolean hasStudentReviewed(Long studentId, Long courseId) {
        return reviewRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }
    @Override
    public List<Review> getReviewsByCourseId(Long courseId) {
        System.out.println("Fetching reviews for course ID: " + courseId);
        List<Review> reviews = reviewRepository.findByCourseId(courseId);
        System.out.println("Reviews found: " + reviews);
        return reviews;
    }

    @Override
    public void deleteRecommendation(Long courseId, String recommendationText) {
        System.out.println("Deleting recommendation for Course ID: " + courseId + ", Text: " + recommendationText);
        List<Review> reviews = reviewRepository.findByCourseId(courseId);

        // Normalize the recommendationText (trim and remove extra spaces)
        String normalizedRecommendationText = recommendationText.trim();

        if (reviews.isEmpty()) {
            System.out.println("No reviews found for Course ID: " + courseId);
            return;
        }

        for (Review review : reviews) {
            System.out.println("Checking review ID: " + review.getId());
            List<Recommendation> recommendations = rec.findByReviewId(review.getId());

            if (recommendations.isEmpty()) {
                System.out.println("No recommendations found for Review ID: " + review.getId());
                continue;
            }

            for (Recommendation recommendation : recommendations) {
                // Normalize the recommendation text from the database before comparison
                String normalizedDbText = recommendation.getRecommendation().trim();
                System.out.println("Checking recommendation ID: " + recommendation.getId() + ", Text: " + normalizedDbText);

                if (normalizedDbText.equals(normalizedRecommendationText)) {
                    System.out.println("Found recommendation to delete: " + recommendation.getId());
                    rec.delete(recommendation); // Delete the recommendation
                    System.out.println("Recommendation deleted successfully.");
                    break;
                }
            }
        }
    }

    @Override
    public String getAIRecommendationsForCourse(Long courseId) {
        System.out.println("Fetching AI recommendations for Course ID: " + courseId);

        // Fetch reviews for the course
        List<Review> reviews = reviewRepository.findByCourseId(courseId);
        System.out.println("Number of reviews found: " + reviews.size());

        // Fetch recommendations for each review
        StringBuilder recommendations = new StringBuilder();
        for (Review review : reviews) {
            List<Recommendation> recs = rec.findByReviewId(review.getId());
            System.out.println("Number of recommendations for Review ID " + review.getId() + ": " + recs.size());
            for (Recommendation rec : recs) {
                recommendations.append(rec.getRecommendation()).append("\n");
            }
        }

        if (recommendations.length() == 0) {
            System.out.println("No recommendations found for Course ID: " + courseId);
            return "No recommendations available for this course.";
        }

        return recommendations.toString().trim();
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
        double averageRating = getAverageRatingByCourseId(courseId);
        courseServiceClient.updateCourseRate(courseId.intValue(), averageRating);
    }
}
