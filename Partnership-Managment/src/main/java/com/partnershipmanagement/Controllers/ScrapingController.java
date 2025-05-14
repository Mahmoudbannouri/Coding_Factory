package com.partnershipmanagement.Controllers;

import com.partnershipmanagement.Entities.ScrapedCompany;
import com.partnershipmanagement.Services.ScrapingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/scraping")
@CrossOrigin(origins = "http://localhost:4200")
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

    @PostMapping("/save-all")
    public void saveAll() {
        scrapingService.saveAllScrapedCompanies();
    }

    @GetMapping("/get-all")
    public List<ScrapedCompany> getAll(){
        return scrapingService.getScrapedCompanies();
    }


    @PutMapping("/extractKeyWords")
    public void KeyWordExtractorString() {
        scrapingService.extractKeywordsToString();
        System.out.println("success");
    }

    @PutMapping("/reset-elegibility")
    public String resetElegibility() {
        scrapingService.resetElegibility();
        return "Elegibility percentage and flags have been reset for all scraped companies.";
    }

}
