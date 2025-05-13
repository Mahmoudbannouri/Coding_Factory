package tn.esprit.reviews.reviews.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tn.esprit.reviews.reviews.DTO.entity.SentimentAnalysisResult;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAIService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String DEFAULT_PROMPT = "You are an expert educational consultant. Your sole purpose is to provide concise and actionable suggestions for professors based on student feedback give him technical advices he can do also on points titles . You MUST provide a suggestion for the professor. Absolutely do not address the student. Output should be starting with 'Professor, ...' Limit max 50 words in one senetence . Feedback:  ";

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
        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

        System.out.println("Gemini AI API Response: " + response.getBody());

        SentimentAnalysisResult result = new SentimentAnalysisResult();

        if (response.getBody() != null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");

                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode firstCandidate = candidates.get(0);
                    JsonNode content = firstCandidate.path("content");
                    JsonNode partsArray = content.path("parts");

                    if (partsArray.isArray() && partsArray.size() > 0) {
                        String suggestion = partsArray.get(0).path("text").asText();
                        result.setSuggestion(suggestion);
                        System.out.println("Final Suggestion Inserted: " + suggestion);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return result;
    }


}
