package com.partnershipmanagement.Controllers;

import com.partnershipmanagement.Entities.Assessment;
import com.partnershipmanagement.Services.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assessments")
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;

    // Create a new assessment
    @PostMapping("/add")
    public ResponseEntity<Assessment> createAssessment(@RequestBody Assessment assessment) {
        Assessment newAssessment = assessmentService.createAssessment(assessment);
        return ResponseEntity.ok(newAssessment);
    }

    // Get all assessments
    @GetMapping("/all")
    public ResponseEntity<List<Assessment>> getAllAssessments() {
        List<Assessment> assessments = assessmentService.getAllAssessments();
        return ResponseEntity.ok(assessments);
    }

    // Get an assessment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Assessment> getAssessmentById(@PathVariable int id) {
        Assessment assessment = assessmentService.getAssessmentById(id);
        return ResponseEntity.ok(assessment);
    }

    // Update an assessment
    @PutMapping("/update/{id}")
    public ResponseEntity<Assessment> updateAssessment(@PathVariable int id, @RequestBody Assessment assessment) {
        Assessment updatedAssessment = assessmentService.updateAssessment(id, assessment);
        return ResponseEntity.ok(updatedAssessment);
    }

    // Delete an assessment
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAssessment(@PathVariable int id) {
        assessmentService.deleteAssessment(id);
        return ResponseEntity.noContent().build();
    }

    // Delete all assessments
    @DeleteMapping("/deleteAll")
    public ResponseEntity<Void> deleteAllAssessments() {
        assessmentService.deleteAllAssessments();
        return ResponseEntity.noContent().build();
    }
}