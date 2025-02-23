package tn.esprit.gestionpfe.services;

import tn.esprit.gestionpfe.entity.Feedback;

import java.util.List;

public interface IFeedbackService {

        Feedback createFeedback(Long pfeId, Feedback feedback);
        List<Feedback> getAllFeedbacks();
        List<Feedback> getFeedbacksByPfe(Long pfeId);
        Feedback updateFeedback(Long id, Feedback updatedFeedback);
        void deleteFeedback(Long id);
    }


