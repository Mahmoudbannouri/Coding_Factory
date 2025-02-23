package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Assessment;
import com.partnershipmanagement.Repositories.AssessmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;

    // Create a new assessment
    public Assessment createAssessment(Assessment assessment) {
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
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found with id: " + id));

        assessment.setScore(assessmentDetails.getScore());
        assessment.setAssessmentDate(assessmentDetails.getAssessmentDate());
        assessment.setFeedback(assessmentDetails.getFeedback());
        assessment.setRules(assessmentDetails.getRules());
        assessment.setPartnership(assessmentDetails.getPartnership());

        return assessmentRepository.save(assessment);
    }

    // Delete an assessment
    public void deleteAssessment(int id) {
        assessmentRepository.deleteById(id);
    }

    // Delete all assessments
    public void deleteAllAssessments() {
        assessmentRepository.deleteAll();
    }
}