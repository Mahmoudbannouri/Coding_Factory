package com.partnershipmanagement.Entities;

import com.partnershipmanagement.Services.PartnershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PartnershipScheduledTasks {

    @Autowired
    private PartnershipService partnershipService;

    // Run every 15 seconds for testing
    @Scheduled(cron = "*/5 * * * * *")
    public void deleteExpiredPartnerships() {
        System.out.println("Running scheduled task to delete expired partnerships...");
        partnershipService.deleteExpiredPartnerships();
    }
}