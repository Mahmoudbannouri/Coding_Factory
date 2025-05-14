package com.partnershipmanagement.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.partnershipmanagement.Entities.ScrapedCompany;
import com.partnershipmanagement.Repositories.ScrapedCompaniesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    @Autowired
    private RestTemplate restTemplate;
    private final String ML_API_URL = "http://localhost:5001/predict"; // Flask endpoint
    @Autowired
    private ScrapedCompaniesRepository scrapedCompanyRepository;
    @Autowired
    private PredictionService predictionService;

    private static final Set<String> KEYWORDS = Set.of(
            "partnership", "collaboration", "ai", "innovation",
            "education", "enterprise", "software", "development","training",
            "customer","blockchain","university","research","startup","cybersecurity",
            "cloud","python","front end","machine learning"
    );

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
//adding scraping keyword weight for better % results

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

    public String sanitizeDescription(String description) {
        if (description != null) {
            // Remove any invalid characters (like invisible control characters, etc.)
            description = description.replaceAll("[^\\x00-\\x7F]", "");  // Remove non-ASCII characters
        }
        return description;
    }

    @Transactional
    public void saveAllScrapedCompanies() {
        RestTemplate restTemplate = new RestTemplate();
        List<Map<String, Object>> companies = restTemplate.getForObject(flaskUrl, List.class);

        if (companies == null) return;

        List<ScrapedCompany> entities = companies.stream().map(data -> {
            ScrapedCompany c = new ScrapedCompany();
            c.setTitle(data.get("Title").toString());
            c.setDescription(sanitizeDescription(data.get("Description").toString()));
            c.setContact(data.get("Contact").toString());
            c.setLink(data.get("Link").toString());
            c.setReviews(Integer.parseInt(data.get("Reviews").toString()));
            c.setScore(Double.parseDouble(data.get("Score").toString()));
            return c;
        }).collect(Collectors.toList());

        scrapedCompanyRepository.saveAll(entities);
    }

    public List<ScrapedCompany> getScrapedCompanies() {
        return scrapedCompanyRepository.findAll();
    }

    public static List<String> extractFrom(String description) {
        if (description == null || description.isBlank()) return List.of();

        String[] words = description.toLowerCase().split("\\W+");

        return Arrays.stream(words)
                .filter(KEYWORDS::contains)
                .distinct()
                .collect(Collectors.toList());
    }



    public void extractKeywordsToString() {
        List<ScrapedCompany> companies = scrapedCompanyRepository.findAll();

        for (ScrapedCompany company : companies) {
            List<String> keywordsList = extractFrom(company.getDescription());
            String keywords = String.join(",", keywordsList);
            company.setKeywords(keywords); // Assuming keywords is now a String field
        }

        scrapedCompanyRepository.saveAll(companies); // Save all in batch
    }



    public void resetElegibility() {
        scrapedCompanyRepository.resetElegibilityForAll();
    }
}
