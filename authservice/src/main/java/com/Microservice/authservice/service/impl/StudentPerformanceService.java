package com.Microservice.authservice.service.impl;

import com.Microservice.authservice.dao.request.StudentPerformanceRequest;
import com.Microservice.authservice.dao.request.response.StudentPerformanceResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Service
public class StudentPerformanceService {
    private static final Logger logger = LoggerFactory.getLogger(StudentPerformanceService.class);

    @Value("${student.performance.service.url}")
    private String performanceServiceUrl;

    private final RestTemplate restTemplate;

    public StudentPerformanceService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public StudentPerformanceResponse predictPerformance(StudentPerformanceRequest request) {
        try {
            // Set up headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Create request entity
            HttpEntity<StudentPerformanceRequest> requestEntity =
                    new HttpEntity<>(request, headers);

            // Build the URL
            String url = performanceServiceUrl + "/api/v1/performance/predict";
            logger.info("Calling prediction service at: {}", url);

            // Make the request
            ResponseEntity<StudentPerformanceResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity,
                    StudentPerformanceResponse.class
            );

            // Check response status
            if (!response.getStatusCode().is2xxSuccessful()) {
                logger.error("Prediction service returned {}", response.getStatusCode());
                throw new HttpServerErrorException(response.getStatusCode(),
                        "Prediction service returned error: " + response.getStatusCode());
            }

            // Log successful prediction
            logger.info("Successfully received prediction response");
            return response.getBody();

        } catch (ResourceAccessException e) {
            logger.error("Connection to prediction service failed", e);
            throw new RuntimeException("Prediction service unavailable: " + e.getMessage());
        } catch (HttpServerErrorException e) {
            logger.error("Prediction service error: {}", e.getStatusCode());
            throw new RuntimeException("Prediction service error: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during prediction", e);
            throw new RuntimeException("Prediction failed: " + e.getMessage());
        }
    }
}