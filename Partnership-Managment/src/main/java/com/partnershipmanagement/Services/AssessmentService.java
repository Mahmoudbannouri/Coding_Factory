package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.*;
import com.partnershipmanagement.Repositories.AssessmentRepository;
import com.partnershipmanagement.Repositories.PartnershipRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;
    @Autowired
    private PartnershipRepository partnershipRepository;

    @Autowired
    private EntrepriseService entrepriseService ;


    // Create a new assessment
    public Assessment createAssessment(Assessment assessment, int partnershipId) {
        Partnership partnership = partnershipRepository.findById(partnershipId)
                .orElseThrow(() -> new EntityNotFoundException("Partnership not found with id: " + partnershipId));

        assessment.setStatus(Status.Pending);
        assessment.setAcceptanceStatus(AcceptanceStatus.Pending);
        assessment.setPartnerAacceptance(false);
        assessment.setAdminAcceptance(false);
        assessment.setPartnership(partnership); // Set the Partnership for this assessment

        setPartnershipScore(assessment.getPartnership().getIdPartnership());
        return assessmentRepository.save(assessment);
    }


    // Get all assessments
    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    // Get an assessment by ID
    public Assessment getAssessmentById(int id) {
        return assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found with id: " + id));
    }
    public List<Assessment> getAssessmentsByPartnershipId(int partnershipId) {
        if (!partnershipRepository.existsById(partnershipId)) {
            throw new EntityNotFoundException("Partnership not found with id: " + partnershipId);
        }
        return assessmentRepository.findByPartnershipId(partnershipId);
    }
    // Update an assessment
    public Assessment updateAssessment(int id, Assessment assessmentDetails) {
        return assessmentRepository.findById(id)
                .map(existingAssessment -> {
                    existingAssessment.setScore(assessmentDetails.getScore());
                    existingAssessment.setFeedback(assessmentDetails.getFeedback());
                    existingAssessment.setStatus(assessmentDetails.getStatus());
                    existingAssessment.setPartnership(assessmentDetails.getPartnership());
                    return assessmentRepository.save(existingAssessment);
                })
                .orElseThrow(() -> new EntityNotFoundException("Assessment not found with id: " + id));
    }


    // Delete an assessment
    public void deleteAssessment(int id) {
        assessmentRepository.deleteById(id);
    }

    // Delete all assessments
    public void deleteAllAssessments() {
        assessmentRepository.deleteAll();
    }

   //Allow one time approval
    public Assessment updateStatusAdmin(int id, AcceptanceStatus status) {
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Assessment not found with id: " + id));


        // Prevent modification if already Approved or Rejected
        if (assessment.getAcceptanceStatus() == AcceptanceStatus.Approved || assessment.getAcceptanceStatus() == AcceptanceStatus.Reject) {
            throw new IllegalStateException("Assessment is already " + assessment.getStatus() + " and cannot be modified.");
        }

        // Admin updates status, and adminAcceptance is set to true
        assessment.setAcceptanceStatus(status);
        assessment.setAdminAcceptance(true);

        // Check if both accepted → Approved
        /*if (assessment.isAdminAcceptance() && assessment.isPartnerAacceptance()) {
            assessment.setAcceptanceStatus(AcceptanceStatus.Approved);
        } else if (status == AcceptanceStatus.Reject) {
            assessment.setAcceptanceStatus(AcceptanceStatus.Reject);
        }*/
        //Apd
        if (assessment.isPartnerAacceptance() && assessment.getAcceptanceStatus() == AcceptanceStatus.Accept) {
            assessment.setAcceptanceStatus(AcceptanceStatus.Approved);
        }

        return assessmentRepository.save(assessment);
    }


    public Assessment updateStatusPartner(int id, AcceptanceStatus status) {
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Assessment not found with id: " + id));

        // Prevent modification if already Approved or Rejected
        if (assessment.getAcceptanceStatus() == AcceptanceStatus.Approved || assessment.getAcceptanceStatus() == AcceptanceStatus.Reject) {
            throw new IllegalStateException("Assessment is already " + assessment.getStatus() + " and cannot be modified.");
        }

        // Partner updates status, and partnerAcceptance is set to true
        assessment.setAcceptanceStatus(status);
        assessment.setPartnerAacceptance(true);

        // Check if both accepted → Approved
        if (assessment.isAdminAcceptance() && assessment.getAcceptanceStatus() == AcceptanceStatus.Accept) {
            assessment.setAcceptanceStatus(AcceptanceStatus.Approved);
        }

        return assessmentRepository.save(assessment);
    }

    public Assessment markAsCompleted(int id) {
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found with id: " + id));

        Proposal proposal = assessment.getPartnership().getProposals();
        LocalDate now = LocalDate.now();
        LocalDate endDate = proposal.getEndDate().toLocalDate();

        if (now.isBefore(endDate)) {
            assessment.setStatus(Status.Done);
            long totalDays = ChronoUnit.DAYS.between(now, endDate);
            if (totalDays >= 10) {
                assessment.setScore(5);
            } else if (totalDays >= 7) {
                assessment.setScore(4);
            } else if (totalDays >= 4) {
                assessment.setScore(3);
            } else if (totalDays >= 1) {
                assessment.setScore(2);
            } else {
                assessment.setScore(1);
            }
        } else {
            assessment.setStatus(Status.Undone);
            assessment.setScore(0);
        }

        Assessment saved = assessmentRepository.save(assessment);
        //return assessmentRepository.save(assessment);
        setPartnershipScore(assessment.getPartnership().getIdPartnership());
        return saved;
    }
    public void setPartnershipScore(int partnershipId) {
        Partnership partnership = partnershipRepository.findById(partnershipId)
                .orElseThrow(() -> new RuntimeException("Partnership not found with id: " + partnershipId));

        List<Assessment> assessments = assessmentRepository.findByPartnershipId(partnershipId);

        if (assessments.isEmpty()) {
            partnership.setScore(0f);
        } else {
            float avg = (float) assessments.stream()
                    .mapToDouble(Assessment::getScore)
                    .average()
                    .orElse(0);
            partnership.setScore(avg);
        }

        partnershipRepository.save(partnership);
        entrepriseService.calculateAndUpdateEntrepriseScore(partnership.getEntreprise().getIdEntreprise());
    }

}
