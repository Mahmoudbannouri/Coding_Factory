package com.partnershipmanagement.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;
import java.util.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
@Service
public class ScrapingService {
    private final String flaskUrl = "http://127.0.0.1:5000/scrape";

    public List<Map<String, Object>> getTop5RelevantCompanies() {
        RestTemplate restTemplate = new RestTemplate();
        List<Map<String, Object>> companies = restTemplate.getForObject(flaskUrl, List.class);

        if (companies == null) return new ArrayList<>();

        // Weighted keywords
        Map<String, Integer> keywords = Map.ofEntries(
                Map.entry("partnership", 5),
                Map.entry("collaboration", 3),
                Map.entry("AI", 19),
                Map.entry("innovation", 2),
                Map.entry("education", 6),
                Map.entry("enterprise", 8),
                Map.entry("software", 30),
                Map.entry("development", 2),
                Map.entry("front end", 1),
                Map.entry("python", 4),
                Map.entry("cloud", 9),
                Map.entry("machine learning", 3),
                Map.entry("data science", 3),
                Map.entry("cybersecurity", 2),
                Map.entry("startup", 1),
                Map.entry("research", 2),
                Map.entry("university", 2),
                Map.entry("blockchain", 1),
                Map.entry("customer", 14),
                Map.entry("training", 17)
        );


        int maxPossibleWeight = keywords.values().stream().mapToInt(i -> i).sum();

        for (Map<String, Object> company : companies) {
            double score = computeWeightedScore(company, keywords, maxPossibleWeight);
            company.put("relevance", score);

            // Add tags based on matched keywords
            List<String> matchedKeywords = getMatchedKeywords(company, keywords);
            company.put("tags", matchedKeywords);
        }

        return companies.stream()
                .sorted((a, b) -> Double.compare((double) b.get("relevance"), (double) a.get("relevance")))
                .limit(5)
                .collect(Collectors.toList());
    }

    private double computeWeightedScore(Map<String, Object> company, Map<String, Integer> keywords, int maxPossibleWeight) {
        String text = company.getOrDefault("description", company.get("Description"))
                .toString()
                .toLowerCase();

        int matchedWeight = 0;

        for (Map.Entry<String, Integer> entry : keywords.entrySet()) {
            String keyword = entry.getKey().toLowerCase();
            int weight = entry.getValue();

            if (text.contains(keyword)) {
                matchedWeight += weight;
            }
        }

        double percentage = (double) matchedWeight / maxPossibleWeight * 100;
        return Math.round(percentage * 10.0) / 10.0;
    }

    private List<String> getMatchedKeywords(Map<String, Object> company, Map<String, Integer> keywords) {
        String text = company.getOrDefault("description", company.get("Description"))
                .toString()
                .toLowerCase();

        List<String> matchedKeywords = new ArrayList<>();

        for (String keyword : keywords.keySet()) {
            if (text.contains(keyword.toLowerCase())) {
                matchedKeywords.add(keyword);
            }
        }

        return matchedKeywords;
    }


    public String getScrapedData() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(flaskUrl, String.class);
    }


}
