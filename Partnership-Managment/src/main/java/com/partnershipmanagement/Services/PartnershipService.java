package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Partnership;
import com.partnershipmanagement.Repositories.PartnershipRepository;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PartnershipService {

    @Autowired
    private PartnershipRepository partnershipRepository;



    // Add these methods to your existing PartnershipService class

    // Create a new partnership
    public Partnership createPartnership(Partnership partnership) {
        return partnershipRepository.save(partnership);
    }

    // Get a partnership by ID
    public Partnership getPartnershipById(int id) {
        return partnershipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partnership not found with ID: " + id));
    }

    // Get all partnerships
    public List<Partnership> getAllPartnerships() {
        return partnershipRepository.findAll();
    }

    // Update a partnership
    public Partnership updatePartnership(int id, Partnership partnership) {
        Partnership existingPartnership = partnershipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partnership not found with ID: " + id));

        // Update fields
        existingPartnership.setPartnershipStatus(partnership.getPartnershipStatus());
        existingPartnership.setEntreprise(partnership.getEntreprise());
        existingPartnership.setProposals(partnership.getProposals());

        return partnershipRepository.save(existingPartnership);
    }

    // Delete a partnership
    public void deletePartnership(int id) {
        partnershipRepository.deleteById(id);
    }

    // Delete all partnerships
    public void deleteAllPartnerships() {
        partnershipRepository.deleteAll();
    }
    @Transactional
    public void deleteExpiredPartnerships() {
        Date currentDate = new Date();
        List<Partnership> partnershipsToDelete = partnershipRepository.findByEndDateBefore(currentDate);

        // Initialize agreements from Proposal before deletion
        for (Partnership partnership : partnershipsToDelete) {
            if (partnership.getProposals() != null) {
                Hibernate.initialize(partnership.getProposals().getAgreements());
            }
        }

        // Delete the expired partnerships
        partnershipRepository.deleteAll(partnershipsToDelete);

        // Log remaining partnerships
        List<Partnership> remainingPartnerships = partnershipRepository.findByEndDateAfter(currentDate);
        System.out.println("Remaining partnerships: " + remainingPartnerships);
    }
}
