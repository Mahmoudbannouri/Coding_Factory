package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Partnership;
import com.partnershipmanagement.Entities.Proposal;
import com.partnershipmanagement.Repositories.PartnershipRepository;
import com.partnershipmanagement.Repositories.ProposalRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
public class ProposalService {

    @Autowired
    private ProposalRepository proposalRepository;
    private PartnershipRepository partnershipRepository;


    // Create a new proposal
    public Proposal createProposal(Proposal proposal) {
        return proposalRepository.save(proposal);
    }

    // Get a proposal by ID
    public Proposal getProposalById(int id) {
        return proposalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposal not found with id: " + id));
    }

    // Get all proposals
    public List<Proposal> getAllProposals() {
        return proposalRepository.findAll();
    }

    // Update a proposal
    public Proposal updateProposal(int id, Proposal proposalDetails) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposal not found with id: " + id));

        proposal.setProposalName(proposalDetails.getProposalName());
        proposal.setProposalDescription(proposalDetails.getProposalDescription());
        proposal.setStartDate(proposalDetails.getStartDate());
        proposal.setEndDate(proposalDetails.getEndDate());
        proposal.setPlannedAmount(proposalDetails.getPlannedAmount());
        proposal.setProposalStatus(proposalDetails.getProposalStatus());
        proposal.setProposalType(proposalDetails.getProposalType());

        return proposalRepository.save(proposal);
    }

    // Delete a proposal
    public void deleteProposal(int id) {
        proposalRepository.deleteById(id);
    }

    // Delete all proposals
    public void deleteAllProposals() {
        proposalRepository.deleteAll();
    }

    @Transactional
    public void deleteExpiredProposals() {
        Date currentDate = new Date(System.currentTimeMillis());
        List<Proposal> proposalsToDelete = proposalRepository.findByEndDateBefore(currentDate);

        // Delete the expired proposals
        proposalRepository.deleteAll(proposalsToDelete);

        // Log remaining proposals
        List<Proposal> remainingProposals = proposalRepository.findByEndDateAfter(currentDate);
        System.out.println("Remaining proposals: " + remainingProposals);
    }
}

