package tn.esprit.reviews.reviews.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tn.esprit.reviews.reviews.DTO.entity.SentimentAnalysisResult;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAIService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String DEFAULT_PROMPT = "As an expert in education, provide one concise and actionable suggestion (max one sentence) for the professor to improve the course based on this student feedback: ";
    public SentimentAnalysisResult analyzeSentiment(String text) {
        String fullPrompt = DEFAULT_PROMPT + text;
        System.out.println("Calling Gemini AI API with text: " + fullPrompt);

        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contents = new HashMap<>();
        Map<String, Object> parts = new HashMap<>();
        parts.put("text", fullPrompt);
        contents.put("parts", List.of(parts));
        requestBody.put("contents", List.of(contents));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

        System.out.println("Gemini AI API Response: " + response.getBody());

        SentimentAnalysisResult result = new SentimentAnalysisResult();

        if (response.getBody() != null) {
            Map<String, Object> responseBody = response.getBody();
            Map<String, Object> candidates = ((List<Map<String, Object>>) responseBody.get("candidates")).get(0);
            Map<String, Object> content = (Map<String, Object>) candidates.get("content");
            List<Map<String, Object>> partsList = (List<Map<String, Object>>) content.get("parts");
            String aiResponse = (String) partsList.get(0).get("text");

            result.setSuggestion(extractSuggestion(aiResponse));
        } else {
            result.setSentiment("Neutral");
            result.setKeyThemes(List.of("Unknown"));
            result.setSuggestion("No suggestions available due to an error.");
        }

        return result;
    }



    public String extractKeyPoints(String aiResponse) {
        System.out.println("AI Response: " + aiResponse);
        String[] lines = aiResponse.split("\n");
        List<String> keyPoints = new ArrayList<>();

        for (String line : lines) {
            if (line.trim().startsWith("*")) {
                keyPoints.add(line.trim().substring(1).trim());
            }
        }

        String conciseRecommendations = String.join(". ", keyPoints.subList(0, Math.min(keyPoints.size(), 3)));

        if (conciseRecommendations.length() > 999999999) {
            return conciseRecommendations.substring(0, 999999999);
        }
        return conciseRecommendations;
    }

    private String extractSuggestion(String aiResponse) {
        String[] lines = aiResponse.split("\n");
        StringBuilder suggestionBuilder = new StringBuilder();

        for (String line : lines) {
            if (line.trim().startsWith("*")) {
                suggestionBuilder.append(line.trim().substring(1).trim()).append(". ");
            }
        }

        String suggestion = suggestionBuilder.toString().trim();

        if (suggestion.length() > 999999999) {
            return suggestion.substring(0,999999999);
        }
        return suggestion;
    }

    public String generateRecommendations(String text) {
        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contents = new HashMap<>();
        Map<String, Object> parts = new HashMap<>();
        parts.put("text", text);
        contents.put("parts", List.of(parts));
        requestBody.put("contents", List.of(contents));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

        if (response.getBody() != null) {
            Map<String, Object> responseBody = response.getBody();
            Map<String, Object> candidates = ((List<Map<String, Object>>) responseBody.get("candidates")).get(0);
            Map<String, Object> content = (Map<String, Object>) candidates.get("content");
            List<Map<String, Object>> partsList = (List<Map<String, Object>>) content.get("parts");
            return (String) partsList.get(0).get("text");
        } else {
            return "Error: Unable to fetch AI response.";
        }
    }
}
