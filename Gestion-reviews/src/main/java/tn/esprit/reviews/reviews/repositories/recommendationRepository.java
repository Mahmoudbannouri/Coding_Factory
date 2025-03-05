package tn.esprit.reviews.reviews.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.reviews.reviews.DTO.entity.Recommendation;
import tn.esprit.reviews.reviews.DTO.entity.Review;

import java.util.List;

public interface recommendationRepository extends JpaRepository<Recommendation, Long> {
     List<Recommendation> findByReviewId(Long reviewId);


}
