package com.partnershipmanagement.Controllers;

import com.partnershipmanagement.Entities.AcceptanceStatus;
import com.partnershipmanagement.Entities.Assessment;
import com.partnershipmanagement.Services.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")  // Allow requests from Angular app

@RestController
@RequestMapping("/assessments")
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;

    // Create a new assessment
    @PostMapping("/add")
    public Assessment createAssessment(@RequestBody Assessment assessment, @RequestParam int partnershipId) {

        return assessmentService.createAssessment(assessment, partnershipId);
    }


    // Get all assessments
    @GetMapping("/all")
    public ResponseEntity<List<Assessment>> getAllAssessments() {
        List<Assessment> assessments = assessmentService.getAllAssessments();
        return ResponseEntity.ok(assessments);
    }
    @GetMapping("/partnership/{partnershipId}")
    public List<Assessment> getAssessmentsByPartnershipId(@PathVariable int partnershipId) {
        return assessmentService.getAssessmentsByPartnershipId(partnershipId);
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

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Assessment> markAsCompleted(@PathVariable int id) {
        Assessment updatedAssessment = assessmentService.markAsCompleted(id);
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

    //two ways approval - admin part

    @PutMapping("/{id}/update-status-admin")
    public Assessment updateStatusAdmin(@PathVariable int id, @RequestParam AcceptanceStatus status) {

        return assessmentService.updateStatusAdmin(id, status);
    }


    //partner check approval
    @PutMapping("/{id}/update-status-partner")
    public Assessment updateStatusPartner(@PathVariable int id, @RequestParam AcceptanceStatus status) {

        return assessmentService.updateStatusPartner(id, status);
    }


}
