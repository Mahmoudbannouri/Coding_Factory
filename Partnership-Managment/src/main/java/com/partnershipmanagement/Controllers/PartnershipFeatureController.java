package com.partnershipmanagement.Controllers;


import com.partnershipmanagement.Entities.Partnership;
import com.partnershipmanagement.Repositories.PartnershipRepository;
import com.partnershipmanagement.Services.PartnershipFeatureService;
import com.partnershipmanagement.dto.PartnershipEligibilityResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/partnership-features")
@RequiredArgsConstructor
public class PartnershipFeatureController {
    private final PartnershipFeatureService featureService;
    private final PartnershipRepository partnershipRepository;

    @GetMapping(value = "/{partnershipId}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getPartnershipFeatures(
            @PathVariable Integer partnershipId) {

        Partnership partnership = partnershipRepository.findWithAssociationsById(partnershipId)
                .orElseThrow(() -> new RuntimeException(
                        "Partnership not found with id: " + partnershipId));
        Double[] features = featureService.calculateFeatures(partnership);
        return ResponseEntity.ok(features);
    }
    @GetMapping("/{id}/eligibility")
    public ResponseEntity<?> checkEligibility(@PathVariable Integer id) {
        try {
            // 1. Load partnership with null checks
            Partnership partnership = partnershipRepository.findWithAssociationsById(id)
                    .orElseThrow(() -> new RuntimeException("Partnership " + id + " not found"));

            // 2. Calculate all features safely
            Double[] features = featureService.calculateFeatures(partnership);

            // 3. Validate features before sending
            if (features.length != 39) {
                throw new IllegalStateException("Expected 39 features, got " + features.length);
            }

            // 4. Call Python API
            Map<String, Object> result = featureService.getEligibility(features);

            // 5. Format response
            return ResponseEntity.ok(Map.of(
                    "is_eligible", result.get("credit_eligible"),
                    "probability", result.getOrDefault("probability", "N/A"),
                    "model_type", result.get("model_type"),
                    "feature_count", features.length,
                    "partnership_id", id
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Eligibility check failed",
                    "partnership_id", id,
                    "cause", e.getMessage(),
                    "solution", "Verify partnership exists and all features are calculated"
            ));
        }
    }

    @GetMapping("/test-python-connection")
    public ResponseEntity<?> testPythonConnection() {
        try {
            Double[] testFeatures = new Double[39];
            Arrays.fill(testFeatures, 0.0);

            Map<String, Object> response = featureService.getEligibility(testFeatures);
            return ResponseEntity.ok("Connection successful: " + response);

        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of(
                    "error", "Python API connection failed",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/test-eligibility")
    public ResponseEntity<?> testEligibilityWithStaticFeatures() {
        Double[] testFeatures = {
                0.10628621,  0.13482495,  0.07000117,  0.40571704, -0.11056972,
                -0.03157248,  0.19253949, -0.0798513 ,  0.26932704, -0.0811328 ,
                0.2744848 ,  0.29237919,  0.30401645, -0.06124874, -0.05626873,
                -0.05394586, -0.05464729, -0.05626873, -0.05672835, -0.04988457,
                -0.0496405 , -0.04915042, -0.0481622 ,  0.39272761, -0.04512541,
                -0.04486692,  0.09473011, -0.06827204, -0.0427646 , -0.02157581,
                0.42489892, -0.02734912, -0.03919637, -0.0220322 , -0.15048822,
                -0.02377905, -0.02335324, -0.02659158, -0.03320249
        };

        try {
            Map<String, Object> result = featureService.getEligibility(testFeatures);

            // Handle potential null values
            Object eligible = result.getOrDefault("credit_eligible", false);
            Object probability = result.getOrDefault("probability", 0.0);

            // Use HashMap instead of Map.of() which doesn't allow nulls
            Map<String, Object> response = new HashMap<>();
            response.put("is_eligible", eligible);
            response.put("probability", probability);
            response.put("features_used", testFeatures.length);
            response.put("note", "Using static test data");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Test failed");
            errorResponse.put("cause", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
