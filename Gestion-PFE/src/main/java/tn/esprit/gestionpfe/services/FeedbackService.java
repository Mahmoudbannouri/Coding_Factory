package tn.esprit.gestionpfe.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.gestionpfe.entity.Feedback;
import tn.esprit.gestionpfe.entity.Pfe;
import tn.esprit.gestionpfe.repository.FeedbackRepository;
import tn.esprit.gestionpfe.repository.PfeRepository;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeedbackService implements IFeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final PfeRepository pfeRepository;

    // Ajouter un feedback à un PFE
    public Feedback createFeedback(Long pfeId, Feedback feedback) {
        return pfeRepository.findById(pfeId).map(pfe -> {
            feedback.setPfe(pfe);
            return feedbackRepository.save(feedback);
        }).orElseThrow(() -> new RuntimeException("PFE not found"));
    }

    // Récupérer tous les feedbacks
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    // Récupérer les feedbacks d'un PFE spécifique
    public List<Feedback> getFeedbacksByPfe(Long pfeId) {
        return feedbackRepository.findByPfeId(pfeId);
    }

    // Mettre à jour un feedback
    public Feedback updateFeedback(Long id, Feedback updatedFeedback) {
        return feedbackRepository.findById(id).map(existingFeedback -> {
            existingFeedback.setAuthor(updatedFeedback.getAuthor());
            existingFeedback.setComment(updatedFeedback.getComment());
            existingFeedback.setDate(updatedFeedback.getDate());
            return feedbackRepository.save(existingFeedback);
        }).orElseThrow(() -> new RuntimeException("Feedback not found"));
    }

    // Supprimer un feedback
    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }
}

