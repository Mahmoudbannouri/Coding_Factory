package com.partnershipmanagement.dto;

import java.util.Map;

public class PartnershipEligibilityResponse {
    private boolean isEligible;
    private String message;
    private Map<String, Object> features;

    // Constructor, getters, and setters
    public PartnershipEligibilityResponse(boolean isEligible, String message, Map<String, Object> features) {
        this.isEligible = isEligible;
        this.message = message;
        this.features = features;
    }
}
