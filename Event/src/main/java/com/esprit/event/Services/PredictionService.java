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

            // Map predicted event to Category enum
            Category category = mapPredictedEventToCategory(predictedEvent);

            // Fetch events from database matching the category
            return eventRepo.findByEventCategory(category);
        } catch (Exception e) {
            throw new RuntimeException("Error predicting events: " + e.getMessage());
        }
    }

    private Category mapPredictedEventToCategory(String predictedEvent) {
        switch (predictedEvent) {
            case "Coding Competition":
                return Category.SECURITY;
            case "Hackathon":
                return Category.WEB_DEVELOPMENT;
            case "Tech Workshop":
                return Category.ARTIFICIAL_INTELLIGENCE;
            case "Entrepreneurship Meetup":
                return Category.CLOUD;
            default:
                throw new IllegalArgumentException("Unknown predicted event: " + predictedEvent);
        }
    }
}
