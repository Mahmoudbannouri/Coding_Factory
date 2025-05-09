package tn.esprit.gestion_pfe.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.gestion_pfe.DAO.entities.Feedback;
import tn.esprit.gestion_pfe.DAO.entities.Pfe;
import tn.esprit.gestion_pfe.DAO.repositories.FeedbackRepository;
import tn.esprit.gestion_pfe.DAO.repositories.PfeRepository;

import java.util.List;
import java.util.ArrayList;
@Service
public class FeedbackService implements IFeedbackService{
@Autowired
    private PfeRepository pfeRepository;
@Autowired
    private FeedbackRepository feedbackRepository;

    @Override
    public List<Pfe> getAllPfe() {
        return pfeRepository.findAll();
    }

    @Override
    public List<Feedback> getFeedbacksByPfe(long pfeId) {
        return feedbackRepository.findByPfeId(pfeId);
    }

    @Override
    public Feedback createFeedback(long pfeId, Feedback feedback) {
        return pfeRepository.findById(pfeId).map(pfe -> {
            feedback.setPfe(pfe);
            return feedbackRepository.save(feedback);
        }).orElseThrow(() -> new RuntimeException("PFE not found"));
    }

    @Override
    public Feedback updateFeedback(long id, Feedback feedback) {
        return feedbackRepository.findById(id).map(existingFeedback -> {
           existingFeedback.setAuthor(feedback.getAuthor());
           existingFeedback.setComment(feedback.getComment());
           existingFeedback.setDate(feedback.getDate());
            return feedbackRepository.save(existingFeedback);
        }).orElseThrow(() -> new RuntimeException("Feedback not found"));
    }


    @Override
        public String deleteFeedback ( long id){
            return "";
        }

    }