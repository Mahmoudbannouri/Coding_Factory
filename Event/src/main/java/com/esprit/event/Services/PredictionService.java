package com.esprit.event.Services;

import com.esprit.event.DAO.entities.*;
import com.esprit.event.DAO.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PredictionService {

    @Autowired
    private EventRepository eventRepo;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String FLASK_API_URL = "http://localhost:5000/predict";

    public List<Event> getRecommendedEvents(Map<String, String> features) {
        try {
            // Prepare form data for Flask API
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            for (Map.Entry<String, String> entry : features.entrySet()) {
                formData.add(entry.getKey(), entry.getValue());
            }

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

            // Call Flask API
            ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_API_URL, request, Map.class);
            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                throw new RuntimeException("Failed to get prediction from Flask API");
            }

            String predictedEvent = (String) response.getBody().get("predicted_event");
            if (predictedEvent == null || predictedEvent.equals("No events predicted")) {
                return Collections.emptyList();
            }
            System.out.println(predictedEvent);
            // Map predicted event to Category enum
            MainCategory category = mapPredictedEventToCategory(predictedEvent);
            List<Event> events = eventRepo.findByMainCategory(category);

// Filter by specificTechnology if provided
            String specificTech = features.get("2.  Actively involved in Specific technology?");
            if (specificTech != null && !specificTech.equalsIgnoreCase("None")) {
                try {
                    Category techCategory = Category.valueOf(specificTech.toUpperCase().replace(" ", "_"));
                    events = events.stream()
                            .filter(event -> event.getEventCategory() == techCategory)
                            .collect(Collectors.toList());
                } catch (IllegalArgumentException e) {
                    // Log invalid category name
                    System.out.println("Invalid specific technology category: " + specificTech);
                    return Collections.emptyList(); // or skip filtering if you prefer
                }
            }

            return events;
        } finally {

        }
    }

    private MainCategory mapPredictedEventToCategory(String predictedEvent) {
        switch (predictedEvent) {
            case "Coding Competition":
                return MainCategory.CODING_COMPETITION;
            case "Hackathon":
                return MainCategory.HACKATHON;
            case "Tech Workshop":
                return MainCategory.TECH_WORKSHOP;
            case "Entrepreneurship Meetup":
                return MainCategory.ENTREPRENEURSHIP_MEETUP;
            default:
                throw new IllegalArgumentException("Unknown predicted event: " + predictedEvent);
        }
    }
}
