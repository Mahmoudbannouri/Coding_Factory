package tn.esprit.gestionpfe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.gestionpfe.entity.Feedback;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByPfeId(Long pfeId);
}
