package tn.esprit.gestion_pfe.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.gestion_pfe.DAO.entities.Feedback;
import tn.esprit.gestion_pfe.DAO.entities.Pfe;
import tn.esprit.gestion_pfe.Services.IFeedbackService;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/feedback")
public class FeedbackRestController {
    @Autowired
    private IFeedbackService  feedbackService;

    @GetMapping
    public List<Pfe> getALL() {
        return feedbackService.getAllPfe();
    }

   @GetMapping("/pfe/{pfeId}")
    public List<Feedback> getFeedbacksByPfe(Long pfeId) {
        return feedbackService.getFeedbacksByPfe(pfeId);
    }

    @PostMapping("/{pfeId}")
    public Feedback createFeedback(Long pfeId, Feedback feedback) {
        return feedbackService.createFeedback(pfeId, feedback);
    }

    @PutMapping("/{id}")
    public Feedback updateFeedback(Long id, Feedback feedback) {
        return feedbackService.updateFeedback(id, feedback);
    }

    @DeleteMapping("/{id}")
    public String deleteFeedback(Long id) {
        return feedbackService.deleteFeedback(id);
    }
}
