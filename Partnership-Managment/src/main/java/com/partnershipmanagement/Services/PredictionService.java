package com.partnershipmanagement.Services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.partnershipmanagement.DTO.PredictionRequest;
import com.partnershipmanagement.DTO.PredictionResponse;
import com.partnershipmanagement.Entities.ScrapedCompany;
import com.partnershipmanagement.Repositories.ScrapedCompaniesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PredictionService {

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ScrapedCompaniesRepository companyRepository;

    private final String FLASK_URL = "http://localhost:5001/predict";
    private final String ASK_URL = "http://localhost:5001/ask"; // New URL for the ask endpoint

    public Map<String, Object> getPrediction(PredictionRequest dto) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PredictionRequest> request = new HttpEntity<>(dto, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_URL, request, Map.class);

        return response.getBody();
    }


    public PredictionResponse getPredictionByCompanyId(int companyId) {
        // Fetch the company from the database
        ScrapedCompany company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with ID: " + companyId));

        // Prepare the DTO to send to Flask
        PredictionRequest dto = new PredictionRequest();
        dto.setReview_count(company.getReviews());
        dto.setRatings(company.getScore());
        dto.setKeywords(company.getKeywords());

        // Set headers for the request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PredictionRequest> request = new HttpEntity<>(dto, headers);

        // Send POST request to Flask API
        ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_URL, request, Map.class);

        Map<String, Object> body = response.getBody();

        // Debug log
        System.out.println("FLASK RESPONSE BODY: " + body);

        // Validate response
        if (body == null) {
            throw new RuntimeException("Flask API returned null body");
        }

        if (!body.containsKey("eligible") || !body.containsKey("percentage")) {
            throw new RuntimeException("Missing keys in Flask response: " + body);
        }

        // Parse response values
        boolean eligible = Boolean.parseBoolean(body.get("eligible").toString());
        float percentage = Float.parseFloat(body.get("percentage").toString().replace("%", "").trim());

        // Return the result
        return new PredictionResponse(eligible, percentage);
    }

    public PredictionResponse getPredictionByCompanyIdAndSave(int companyId) {
        // Fetch the company from the database
        ScrapedCompany company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with ID: " + companyId));

        // Prepare the DTO to send to Flask
        PredictionRequest dto = new PredictionRequest();
        dto.setReview_count(company.getReviews());
        dto.setRatings(company.getScore());
        dto.setKeywords(company.getKeywords());

        // Set headers for the request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PredictionRequest> request = new HttpEntity<>(dto, headers);

        // Send POST request to Flask API
        ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_URL, request, Map.class);

        Map<String, Object> body = response.getBody();

        // Debug log
        System.out.println("FLASK RESPONSE BODY: " + body);

        // Validate response
        if (body == null) {
            throw new RuntimeException("Flask API returned null body");
        }

        if (!body.containsKey("eligible") || !body.containsKey("probability")) {
            throw new RuntimeException("Missing keys in Flask response: " + body);
        }

        // Parse response values
        boolean eligible = Boolean.parseBoolean(body.get("eligible").toString());
        float probability = Float.parseFloat(body.get("probability").toString());

        // Update the company entity with the new values
        company.setElegible(eligible);
        company.setElegibilityPrecentage(probability);

        // Save the updated company entity back to the database
        companyRepository.save(company);

        // Return the result
        return new PredictionResponse(eligible, probability);
    }


    public void predictAllCompaniesEligibility() {
        // Fetch all companies from the database
        List<ScrapedCompany> companies = companyRepository.findAll();

        for (ScrapedCompany company : companies) {
            try {
                // Prepare the DTO to send to Flask
                PredictionRequest dto = new PredictionRequest();
                dto.setReview_count(company.getReviews());
                dto.setRatings(company.getScore());
                dto.setKeywords(company.getKeywords());

                // Set headers for the request
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<PredictionRequest> request = new HttpEntity<>(dto, headers);

                // Send POST request to Flask API
                ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_URL, request, Map.class);

                Map<String, Object> body = response.getBody();

                // Debug log
                System.out.println("FLASK RESPONSE BODY: " + body);

                // Validate response
                if (body == null) {
                    throw new RuntimeException("Flask API returned null body");
                }

                if (!body.containsKey("eligible") || !body.containsKey("probability")) {
                    throw new RuntimeException("Missing keys in Flask response: " + body);
                }

                // Parse response values
                boolean eligible = Boolean.parseBoolean(body.get("eligible").toString());
                float probability = Float.parseFloat(body.get("probability").toString());

                // Update the company entity with the new values
                company.setElegible(eligible);
                company.setElegibilityPrecentage(probability);

                // Save the updated company entity back to the database
                companyRepository.save(company);
            } catch (Exception e) {
                System.err.println("Error processing company: " + company.getTitle() + ". Error: " + e.getMessage());
                // Optionally, rethrow the exception or handle it as needed
            }
        }


    }
    public Map<String, Object> askQuestion(String question) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create the request body
        Map<String, String> requestBody = Map.of("question", question);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(ASK_URL, request, Map.class);

        return response.getBody();
    }
}
