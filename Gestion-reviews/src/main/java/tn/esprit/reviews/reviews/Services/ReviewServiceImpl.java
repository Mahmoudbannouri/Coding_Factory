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

    @Override
    public Review addReview(Review review) {
        SentimentAnalysisResult result = geminiAIService.analyzeSentiment(review.getComment());
        System.out.println("Sentiment Analysis Result: " + result);
        Review savedReview = reviewRepository.save(review);
        // Generate recommendations using the AI service
        String aiRecommendations = geminiAIService.generateRecommendations(review.getComment());
        String formattedRecommendations = geminiAIService.extractKeyPoints(aiRecommendations);
        Recommendation recommendation = new Recommendation();
        recommendation.setRecommendation(formattedRecommendations);
        recommendation.setReview(savedReview);
        rec.save(recommendation);

        updateCourseRate(review.getCourseId());

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
    public void deleteRecommendation(Long courseId, String recommendationText) {
        System.out.println("Deleting recommendation for Course ID: " + courseId + ", Text: " + recommendationText);
        List<Review> reviews = reviewRepository.findByCourseId(courseId);
        for (Review review : reviews) {
            List<Recommendation> recommendations = rec.findByReviewId(review.getId());
            for (Recommendation recommendation : recommendations) {
                if (recommendation.getRecommendation().equals(recommendationText)) {
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
