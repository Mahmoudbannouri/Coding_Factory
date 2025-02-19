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

    @Transactional
    public void deleteExpiredPartnerships() {
        Date currentDate = new Date();
        List<Partnership> partnershipsToDelete = partnershipRepository.findByEndDateBefore(currentDate);

        // Initialize the agreements collection for each partnership (if needed)
        for (Partnership partnership : partnershipsToDelete) {
            Hibernate.initialize(partnership.getAgreements()); // Initialize the collection
        }

        // Delete the partnerships
        partnershipRepository.deleteAll(partnershipsToDelete);

        // Log remaining partnerships (those with endDate less than the current date)
        List<Partnership> remainingPartnerships = partnershipRepository.findByEndDateAfter(currentDate);
        System.out.println("Remaining partnerships: " + remainingPartnerships);
    }}