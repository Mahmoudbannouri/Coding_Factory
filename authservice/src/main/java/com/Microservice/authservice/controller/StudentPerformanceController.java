package com.Microservice.authservice.controller;

import com.Microservice.authservice.dao.request.StudentPerformanceRequest;
import com.Microservice.authservice.dao.request.response.StudentPerformanceResponse;
import com.Microservice.authservice.service.impl.StudentPerformanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/v1/performance")
@RequiredArgsConstructor
@Validated
public class StudentPerformanceController {

    private final StudentPerformanceService studentPerformanceService;

    @PostMapping("/predict")
    public ResponseEntity<StudentPerformanceResponse> predictPerformance(
            @Valid @RequestBody StudentPerformanceRequest request) {
        return ResponseEntity.ok(studentPerformanceService.predictPerformance(request));
    }
}