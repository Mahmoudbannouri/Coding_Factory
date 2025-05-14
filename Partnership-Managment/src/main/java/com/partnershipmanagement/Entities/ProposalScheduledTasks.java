package com.partnershipmanagement.Entities;

import com.partnershipmanagement.Services.ProposalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ProposalScheduledTasks {

    @Autowired
    private ProposalService proposalService;

    // Run every 5 seconds for testing
    @Scheduled(cron = "*/5 * * * * *")
    public void deleteExpiredProposals() {
        System.out.println("Running scheduled task to delete expired proposals...");
        proposalService.deleteExpiredProposals();
    }
}
