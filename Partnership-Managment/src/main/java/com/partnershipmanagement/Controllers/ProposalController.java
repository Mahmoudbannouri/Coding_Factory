package com.partnershipmanagement.Controllers;

import com.partnershipmanagement.Entities.Proposal;
import com.partnershipmanagement.Services.ProposalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proposals")
public class ProposalController {

    @Autowired
    private ProposalService proposalService;

    // Create a new proposal
    @PostMapping("/add")
    public ResponseEntity<Proposal> createProposal(@RequestBody Proposal proposal) {
        Proposal newProposal = proposalService.createProposal(proposal);
        return ResponseEntity.ok(newProposal);
    }

    // Get a proposal by ID
    @GetMapping("/{id}")
    public ResponseEntity<Proposal> getProposalById(@PathVariable int id) {
        Proposal proposal = proposalService.getProposalById(id);
        return ResponseEntity.ok(proposal);
    }

    // Get all proposals
    @GetMapping("/all")
    public ResponseEntity<List<Proposal>> getAllProposals() {
        List<Proposal> proposals = proposalService.getAllProposals();
        return ResponseEntity.ok(proposals);
    }

    // Update a proposal
    @PutMapping("/update/{id}")
    public ResponseEntity<Proposal> updateProposal(@PathVariable int id, @RequestBody Proposal proposal) {
        Proposal updatedProposal = proposalService.updateProposal(id, proposal);
        return ResponseEntity.ok(updatedProposal);
    }

    // Delete a proposal
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProposal(@PathVariable int id) {
        proposalService.deleteProposal(id);
        return ResponseEntity.noContent().build();
    }

    // Delete all proposals
    @DeleteMapping("/deleteAll")
    public ResponseEntity<Void> deleteAllProposals() {
        proposalService.deleteAllProposals();
        return ResponseEntity.noContent().build();
    }
}