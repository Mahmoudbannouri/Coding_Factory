package tn.esprit.gestion_pfe.Services;

import tn.esprit.gestion_pfe.DAO.entities.Feedback;
import tn.esprit.gestion_pfe.DAO.entities.Pfe;

import java.util.List;
import java.util.ArrayList;
public interface IFeedbackService {
    List<Pfe> getAllPfe();

    List<Feedback> getFeedbacksByPfe(long pfeId);

    Feedback createFeedback(long pfeId, Feedback feedback);

    Feedback updateFeedback(long id, Feedback feedback);

    String deleteFeedback(long id);
}
