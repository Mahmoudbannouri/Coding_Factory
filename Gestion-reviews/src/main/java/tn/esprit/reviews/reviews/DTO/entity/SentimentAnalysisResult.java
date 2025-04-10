package tn.esprit.reviews.reviews.DTO.entity;

import java.util.List;

public class SentimentAnalysisResult {
    private String sentiment; // Positive, Negative, Neutral
    private List<String> keyThemes; // Key themes/topics in the review
    private String suggestion; // Suggestions for improvement

    public String getSentiment() {
        return sentiment;
    }

    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }

    public List<String> getKeyThemes() {
        return keyThemes;
    }

    public void setKeyThemes(List<String> keyThemes) {
        this.keyThemes = keyThemes;
    }

    public String getSuggestion() {
        return suggestion;
    }

    public void setSuggestion(String suggestion) {
        this.suggestion = suggestion;
    }

    // Getters and setters
}