package com.partnershipmanagement.Controllers;

import com.partnershipmanagement.DTO.PredictionRequest;
import com.partnershipmanagement.DTO.PredictionResponse;
import com.partnershipmanagement.Services.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/prediction")
@CrossOrigin(origins = "http://localhost:4200")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @PostMapping("/predict")
    public ResponseEntity<?> predict(@RequestBody PredictionRequest request) {
        return ResponseEntity.ok(predictionService.getPrediction(request));
    }

    @PostMapping("/predictionByCompanyId/{companyId}")
    public PredictionResponse getPrediction(@PathVariable int companyId) {
        return predictionService.getPredictionByCompanyId(companyId);
    }

    @GetMapping("/savePredictionByCompanyId/{companyId}")
    public PredictionResponse savePredictionByCompanyId(@PathVariable int companyId) {
        return predictionService.getPredictionByCompanyIdAndSave(companyId);
    }

    @GetMapping("/predictAll")
    public void predictAllCompaniesEligibility() {
        predictionService.predictAllCompaniesEligibility();
    }
    @PostMapping("/ask")
    public ResponseEntity<?> ask(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        Map<String, Object> response = predictionService.askQuestion(question);
        return ResponseEntity.ok(response);
    }
}
