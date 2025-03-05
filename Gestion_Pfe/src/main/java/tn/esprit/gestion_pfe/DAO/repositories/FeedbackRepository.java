package tn.esprit.gestion_pfe.DAO.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.gestion_pfe.DAO.entities.Feedback;

import java.util.List;
import java.util.ArrayList;
public interface FeedbackRepository extends JpaRepository<Feedback ,Long> {

    List<Feedback> findByPfeId(Long pfeId);
}
