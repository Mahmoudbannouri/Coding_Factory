package com.esprit.event.Services;

import com.esprit.event.DAO.entities.Event;
import com.esprit.event.OpenFeign.CenterClient;
import com.esprit.event.OpenFeign.CenterDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiAiService {
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    private static final String API_KEY = "AIzaSyANt-b9SxtIhencQ4IV7OHtoGGjFBtD0NQ";


    public ResponseEntity<Map<String, String>> generateEventDescription(Event event) throws IOException {
        // Construct the prompt without failing if center info is missing
        String prompt = String.format(
                "Generate a detailed event description based on the following details:\n" +
                        "Event Name: %s\n" +
                        "Event Date: %s\n" +
                        "Event Category: %s\n" +
                        "Event Description: %s\n" +
                        "that does not exceed 255 characters",
                event.getEventName(),
                event.getEventDate(),
                event.getEventCategory(),
                event.getEventDescription()
        );
        // Create the HTTP client
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost(GEMINI_API_URL + "?key=" + API_KEY);
            httpPost.setHeader("Content-Type", "application/json");

            // Prepare the request body
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            content.put("parts", new Object[]{Map.of("text", prompt)});
            requestBody.put("contents", new Object[]{content});

            // Convert request body to JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonBody = objectMapper.writeValueAsString(requestBody);
            httpPost.setEntity(new StringEntity(jsonBody));

            // Execute the request
            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                HttpEntity responseEntity = response.getEntity();
                String responseString = EntityUtils.toString(responseEntity);

                // Parse response
                JsonNode responseJson = objectMapper.readTree(responseString);
                JsonNode candidates = responseJson.path("candidates");

                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode contentNode = candidates.get(0).path("content");
                    JsonNode parts = contentNode.path("parts");

                    if (parts.isArray() && parts.size() > 0) {
                        String generatedText = parts.get(0).path("text").asText();

                        // Remove markdown * and # symbols (for bold and headings)
                        generatedText = generatedText.replaceAll("\\*+", ""); // Remove bold markers
                        generatedText = generatedText.replaceAll("^(#)+\\s*", ""); // Remove headings # symbols
                        // Step 1: Extract only the center name for the "Location" field

// Step 2: Remove any "About the Venue" section from the generated text
                        generatedText = generatedText.replaceAll("About the Venue:.*", "");
                        // Return as ResponseEntity
                        Map<String, String> result = new HashMap<>();
                        result.put("description", generatedText);

                        // Return the response entity
                        return ResponseEntity.ok(result); // Wrap the map in ResponseEntity
                    }
                }
                throw new IOException("Invalid response structure from Gemini API");
            }
        }
    }
}
