package com.Microservice.authservice.dao.request.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentPerformanceResponse {
    private String prediction;
    private Map<String, Double> probabilities;
}