package com.partnershipmanagement.Services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ScrapingService {
    private final String flaskUrl = "http://127.0.0.1:5000/scrape";

    public String getScrapedData() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(flaskUrl, String.class);
    }
}
