package tn.esprit.gestion_pfe.Controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import tn.esprit.gestion_pfe.DAO.entities.ChatbotHistory;
import tn.esprit.gestion_pfe.DAO.repositories.ChatbotHistoryRepository;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotRestController {

    @Autowired
    private ChatbotHistoryRepository chatbotHistoryRepository;


    // Sauvegarde de l'historique avec validation
    @PostMapping("/history")
    public ResponseEntity<?> saveChatHistory(@Valid @RequestBody ChatbotHistory chatHistory, BindingResult result) {
        System.out.println("Received chat history: " + chatHistory.toString());

        if (result.hasErrors()) {
            System.out.println("Validation errors: " + result.getAllErrors());
            return ResponseEntity.badRequest().body("Données invalides");
        }

        if (chatHistory.getCreatedAt() == null) {
            chatHistory.setCreatedAt(new Date());
        }

        try {
            ChatbotHistory saved = chatbotHistoryRepository.save(chatHistory);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de l'enregistrement");
        }
    }

    // ChatbotRestController.java
    @GetMapping("/history")
    public ResponseEntity<Page<ChatbotHistory>> getAllChatHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ChatbotHistory> historyPage = chatbotHistoryRepository.findAll(pageable);

        // Vérification des dates invalides
        historyPage.getContent().forEach(history -> {
            if (history.getCreatedAt().before(new Date(0))) { // Date < 1970
                history.setCreatedAt(new Date()); // Correction avec date actuelle
            }
        });

        return ResponseEntity.ok(historyPage);
    }
    // Récupération des feedbacks avec filtre
    @GetMapping("/feedback")
    public ResponseEntity<List<ChatbotHistory>> getFeedbacks(
            @RequestParam(required = false) String search) {

        List<ChatbotHistory> feedbacks = chatbotHistoryRepository.findAll()
                .stream()
                .filter(history -> history.getFeedback() != null && !history.getFeedback().isEmpty())
                .filter(history -> search == null || history.getFeedback().contains(search))
                .collect(Collectors.toList());

        return ResponseEntity.ok(feedbacks);
    }

    // Sauvegarde du feedback avec vérification d'existence
    @PostMapping("/feedback/{id}")
    public ResponseEntity<?> saveFeedback(@PathVariable Long id,
                                          @RequestParam String feedback) {

        return chatbotHistoryRepository.findById(id)
                .map(history -> {
                    history.setFeedback(feedback);
                    chatbotHistoryRepository.save(history);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
