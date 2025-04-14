package com.partnershipmanagement.Controllers;

import com.partnershipmanagement.Services.ScrapingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/scraping")
public class ScrapingController {
    private final ScrapingService scrapingService;

    public ScrapingController(ScrapingService scrapingService) {
        this.scrapingService = scrapingService;
    }

    @GetMapping("/scrape")
    public String scrapeData() {
        return scrapingService.getScrapedData();
    }
    @GetMapping("/top5-keywords")
    public List<Map<String, Object>> getTop5ByKeywords() {
        return scrapingService.getTop5RelevantCompanies();
    }

}
