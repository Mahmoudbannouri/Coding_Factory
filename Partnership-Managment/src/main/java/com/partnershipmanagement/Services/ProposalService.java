package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Proposal;
import com.partnershipmanagement.Repositories.ProposalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProposalService {

    @Autowired
    private ProposalRepository proposalRepository;

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
        proposal.setAgreements(proposalDetails.getAgreements());
        proposal.setUser(proposalDetails.getUser());
        proposal.setCenter(proposalDetails.getCenter());

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
}