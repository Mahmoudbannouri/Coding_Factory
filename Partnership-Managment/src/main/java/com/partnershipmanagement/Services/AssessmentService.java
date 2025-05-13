package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.AcceptanceStatus;
import com.partnershipmanagement.Entities.Assessment;
import com.partnershipmanagement.Entities.Partnership;
import com.partnershipmanagement.Entities.Status;
import com.partnershipmanagement.Repositories.AssessmentRepository;
import com.partnershipmanagement.Repositories.PartnershipRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;
    @Autowired
    private PartnershipRepository partnershipRepository;

    // Create a new assessment
    public Assessment createAssessment(Assessment assessment, int partnershipId) {
        Partnership partnership = partnershipRepository.findById(partnershipId)
                .orElseThrow(() -> new EntityNotFoundException("Partnership not found with id: " + partnershipId));

        assessment.setStatus(Status.Pending);
        assessment.setAcceptanceStatus(AcceptanceStatus.Pending);
        assessment.setPartnerAacceptance(false);
        assessment.setAdminAcceptance(false);
        assessment.setPartnership(partnership); // Set the Partnership for this assessment

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


}