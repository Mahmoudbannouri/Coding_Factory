package tn.esprit.gestionpfe.restControlier;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.gestionpfe.entity.Feedback;
import tn.esprit.gestionpfe.entity.Pfe;
import tn.esprit.gestionpfe.services.FeedbackService;
import java.util.List;

@RestController
@RequestMapping("/feedbacks")
@RequiredArgsConstructor
public class FeedbackRestApi {
    private final FeedbackService feedbackService;


    private String hello = "Hello, I'm the Pfe MS";

    @RequestMapping("/helloFeedback")
    public String sayHello() {
        return hello;
    }



    // Ajouter un feedback à un PFE valider
    @PostMapping("/{pfeId}")
    public ResponseEntity<Feedback> createFeedback(@PathVariable Long pfeId, @RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.createFeedback(pfeId, feedback));
    }



    // Récupérer tous les feedbacks
    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }

    // Récupérer les feedbacks d'un PFE spécifique valider
    @GetMapping("/pfe/{pfeId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByPfe(@PathVariable Long pfeId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByPfe(pfeId));
    }

    // Mettre à jour un feedback valider
    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable Long id, @RequestBody Feedback updatedFeedback) {
        return ResponseEntity.ok(feedbackService.updateFeedback(id, updatedFeedback));
    }

    // Supprimer un feedback valider
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }
}

