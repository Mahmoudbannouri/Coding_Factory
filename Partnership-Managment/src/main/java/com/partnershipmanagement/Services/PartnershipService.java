package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Entreprise;
import com.partnershipmanagement.Entities.Partnership;
import com.partnershipmanagement.Entities.PartnershipStatus;
import com.partnershipmanagement.Entities.Proposal;
import com.partnershipmanagement.Repositories.EntrepriseRepository;
import com.partnershipmanagement.Repositories.PartnershipRepository;
import com.partnershipmanagement.Repositories.ProposalRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Service
public class PartnershipService implements IPartnershipService {

    @Autowired
    private PartnershipRepository partnershipRepository;
    @Autowired
    private EntrepriseRepository entrepriseRepository;
    @Autowired
    private ProposalRepository proposalRepository;

    // Validate Partnership Input
    public void validatePartnership(Partnership partnership) {
        if (partnership.getEntreprise() == null) {
            throw new IllegalArgumentException("Entreprise cannot be null");
        }

        if (partnership.getProposals() == null) {
            throw new IllegalArgumentException("Proposal cannot be null");
        }

        if (partnership.getPartnershipStatus() == null) {
            throw new IllegalArgumentException("Partnership status cannot be null");
        }

        // Check start and end date logic
        if (partnership.getProposals().getStartDate() == null || partnership.getProposals().getEndDate() == null) {
            throw new IllegalArgumentException("Start and End dates must be provided");
        }

        if (partnership.getProposals().getEndDate().before(partnership.getProposals().getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before the start date");
        }

        // Optional: Ensure the planned amount is greater than zero
        if (partnership.getProposals().getPlannedAmount() <= 0) {
            throw new IllegalArgumentException("Planned amount must be greater than zero");
        }
    }

    // Create a new partnership
    public Partnership createPartnership(Partnership partnership) {
        validatePartnership(partnership); // Validate the partnership before saving
        return partnershipRepository.save(partnership);
    }

    public Partnership addPartnershipByEntrepriseName(String nameEntreprise, Proposal proposal) {
        // Find entreprise by name
        Entreprise entreprise = entrepriseRepository.findByName(nameEntreprise);
        // Save proposal (if needed)
        Proposal savedProposal = proposalRepository.save(proposal);

        // Create Partnership
        Partnership partnership = new Partnership();
        partnership.setEntreprise(entreprise);
        partnership.setProposals(savedProposal);
        partnership.setPartnershipStatus(PartnershipStatus.pending); // Default status

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

        validatePartnership(partnership); // Validate the partnership before updating

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

    public Partnership applyForPartnership(int entrepriseId, int proposalId) {
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new EntityNotFoundException("Entreprise not found with id " + entrepriseId));

        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new EntityNotFoundException("Proposal not found with id " + proposalId));

        // If the proposal is already "FULFILLED", block the application
        if (proposal.getProposalStatus().equals("FULFILLED")) {
            throw new IllegalStateException("This proposal has already been fulfilled. No more applications are allowed.");
        }

        // Check if any existing partnership for this proposal is already ACCEPTED
        boolean isAccepted = partnershipRepository.existsByProposalIdProposalAndPartnershipStatus(proposalId, PartnershipStatus.Approved);

        if (isAccepted) {
            // Update proposal status to "FULFILLED" and prevent further applications
            proposal.setProposalStatus("FULFILLED");
            proposalRepository.save(proposal);
            throw new IllegalStateException("A partnership for this proposal has already been accepted. No further applications are allowed.");
        }

        // Create a new Partnership with status PENDING
        Partnership partnership = new Partnership();
        partnership.setEntreprise(entreprise);
        partnership.setProposals(proposal);
        partnership.setPartnershipStatus(PartnershipStatus.pending);

        return partnershipRepository.save(partnership);
    }

    @Transactional
    public void deleteExpiredPartnerships() {
        Date currentDate = new Date();
        List<Partnership> partnershipsToDelete = partnershipRepository.findByEndDateBefore(currentDate);

        // Delete the expired partnerships
        partnershipRepository.deleteAll(partnershipsToDelete);

        // Log remaining partnerships
        List<Partnership> remainingPartnerships = partnershipRepository.findByEndDateAfter(currentDate);
        System.out.println("Remaining partnerships: " + remainingPartnerships);
    }

    @Transactional
    public void acceptPartnership(int partnershipId, int entrepriseId) {
        // Retrieve the partnership by ID
        Partnership partnership = partnershipRepository.findById(partnershipId)
                .orElseThrow(() -> new EntityNotFoundException("Partnership not found"));

        // Check if the enterprise ID matches
        if (partnership.getEntreprise().getIdEntreprise() != entrepriseId) {
            throw new IllegalArgumentException("This partnership does not belong to the given enterprise.");
        }

        // Retrieve the associated proposal
        Proposal proposal = partnership.getProposals();
        if (proposal == null) {
            throw new IllegalStateException("Proposal not found for this partnership.");
        }

        // Accept the selected partnership
        partnership.setPartnershipStatus(PartnershipStatus.Approved);

        // Reject all other partnerships for the same proposal
        List<Partnership> otherPartnerships = partnershipRepository.findByProposal(proposal);
        for (Partnership p : otherPartnerships) {
            if (p.getIdPartnership() != partnershipId) {
                p.setPartnershipStatus(PartnershipStatus.Rejected);
            }
        }

        // Update the proposal status
        proposal.setProposalStatus("fulfilled");

        // Save changes
        partnershipRepository.saveAll(otherPartnerships);
        partnershipRepository.save(partnership);
        proposalRepository.save(proposal);
    }

    // Generate PDF for the Partnership
    public byte[] generatePdfForPartnership(Partnership partnership) {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                PDType1Font boldFont = PDType1Font.HELVETICA_BOLD;
                PDType1Font regularFont = PDType1Font.HELVETICA;

                float margin = 50;
                float width = page.getMediaBox().getWidth();
                float height = page.getMediaBox().getHeight();
                float y = height - margin;

                // Draw border
                content.setStrokingColor(200, 200, 200); // light gray
                content.addRect(margin - 10, margin - 10, width - 2 * (margin - 10), height - 2 * (margin - 10));
                content.stroke();

                // Title
                content.setNonStrokingColor(0, 0, 0);
                content.setFont(boldFont, 26);
                content.beginText();
                content.newLineAtOffset(margin, y);
                content.showText("PARTNERSHIP CONTRACT");
                content.endText();

                // Contract No.
                content.setFont(regularFont, 12);
                content.beginText();
                content.newLineAtOffset(width - margin - 100, y);
                content.showText("No. " + String.format("%06d", partnership.getIdPartnership()));
                content.endText();

                y -= 40;

                // Date
                content.setFont(boldFont, 12);
                content.beginText();
                content.newLineAtOffset(margin, y);
                content.showText("Date: ");
                content.setFont(regularFont, 12);
                content.showText(LocalDate.now().toString());
                content.endText();

                y -= 30;

                // Billed To and From
                float colWidth = 250;
                float gap = 40;
                float leftX = margin;
                float rightX = margin + colWidth + gap;

                content.setFont(boldFont, 12);
                content.beginText();
                content.newLineAtOffset(leftX, y);
                content.showText("Billed to:");
                content.endText();

                content.beginText();
                content.newLineAtOffset(rightX, y);
                content.showText("From:");
                content.endText();

                y -= 15;
                content.setFont(regularFont, 10);
                content.beginText();
                content.newLineAtOffset(leftX, y);
                content.showText(partnership.getEntreprise().getNameEntreprise());
                content.endText();

                content.beginText();
                content.newLineAtOffset(rightX, y);
                content.showText("Coding Factory");
                content.endText();

                y -= 12;
                content.beginText();
                content.newLineAtOffset(leftX, y);
                content.showText(partnership.getEntreprise().getEmailEntreprise());
                content.endText();

                content.beginText();
                content.newLineAtOffset(rightX, y);
                content.showText("contact@codingfactory.com");
                content.endText();

                y -= 40;

                // Table Header
                content.setNonStrokingColor(230, 230, 230);
                content.addRect(margin, y, width - 2 * margin, 20);
                content.fill();
                content.setNonStrokingColor(0, 0, 0);

                content.setFont(boldFont, 12);
                content.beginText();
                content.newLineAtOffset(margin + 5, y + 5);
                content.showText("Item");
                content.newLineAtOffset(180, 0);
                content.showText("Details");
                content.newLineAtOffset(180, 0);
                content.showText("Amount");
                content.endText();

                y -= 25;

                // Table rows
                content.setFont(regularFont, 11);
                content.beginText();
                content.newLineAtOffset(margin + 5, y);
                content.showText("Contract Period");
                content.newLineAtOffset(180, 0);
                content.showText(partnership.getProposals().getStartDate() + " to " + partnership.getProposals().getEndDate());
                content.newLineAtOffset(180, 0);
                content.showText("-");
                content.endText();

                y -= 20;
                content.beginText();
                content.newLineAtOffset(margin + 5, y);
                content.showText("Planned Amount");
                content.newLineAtOffset(180, 0);
                content.showText("Agreed upon");
                content.newLineAtOffset(180, 0);
                content.showText(String.format("$%.2f", partnership.getProposals().getPlannedAmount()));
                content.endText();

                y -= 20;
                content.beginText();
                content.newLineAtOffset(margin + 5, y);
                content.showText("Status");
                content.newLineAtOffset(180, 0);
                content.showText("-");
                content.newLineAtOffset(180, 0);
                content.showText(partnership.getPartnershipStatus().toString());
                content.endText();

                y -= 40;

                // Total
                content.setFont(boldFont, 12);
                content.beginText();
                content.newLineAtOffset(margin + 360, y);
                content.showText("Total:");
                content.endText();

                content.beginText();
                content.newLineAtOffset(margin + 450, y);
                content.showText(String.format("$%.2f", partnership.getProposals().getPlannedAmount()));
                content.endText();

                y -= 40;

                // Payment method and note
                content.setFont(boldFont, 11);
                content.beginText();
                content.newLineAtOffset(margin, y);
                content.showText("Payment method: ");
                content.setFont(regularFont, 11);
                content.showText("Bank Transfer");
                content.endText();

                y -= 15;
                content.setFont(boldFont, 11);
                content.beginText();
                content.newLineAtOffset(margin, y);
                content.showText("Note: ");
                content.setFont(regularFont, 11);
                content.showText("We appreciate your collaboration.");
                content.endText();

                y -= 40;

                // Agreements
                content.setFont(boldFont, 12);
                content.setNonStrokingColor(70, 130, 180); // steel blue
                content.beginText();
                content.newLineAtOffset(margin, y);
                content.showText("Agreements:");
                content.endText();
                content.setNonStrokingColor(0, 0, 0);

                y -= 20;
                String[] agreements = {
                        "• All information exchanged must remain confidential.",
                        "• Payment must be made within 15 business days after invoice date.",
                        "• Disputes will be handled in good faith within 30 working days."
                };

                content.setFont(regularFont, 11);
                for (String ag : agreements) {
                    content.beginText();
                    content.newLineAtOffset(margin + 10, y);
                    content.showText(ag);
                    content.endText();
                    y -= 15;
                }

                y -= 50;

                // Signature Section
                content.setFont(boldFont, 12);
                content.beginText();
                content.newLineAtOffset(margin, y);
                content.showText("Signature (Entreprise):");
                content.endText();

                content.beginText();
                content.newLineAtOffset(width / 2 + 20, y);
                content.showText("Signature (Coding Factory):");
                content.endText();

                // Signature Lines
                y -= 30;
                content.setStrokingColor(0, 0, 0);
                content.moveTo(margin, y);
                content.lineTo(margin + 200, y);
                content.stroke();

                content.moveTo(width / 2 + 20, y);
                content.lineTo(width / 2 + 220, y);
                content.stroke();
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate PDF: " + e.getMessage(), e);
        }
    }

    public List<Partnership> getPartnershipsForEntreprise(int entrepriseId) {
        return partnershipRepository.findByEntrepriseIdEntreprise(entrepriseId);  // Fetch partnerships by Entreprise ID
    }

}
