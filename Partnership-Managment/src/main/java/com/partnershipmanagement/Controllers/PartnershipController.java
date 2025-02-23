package com.partnershipmanagement.Controllers;

import com.partnershipmanagement.Entities.Partnership;
import com.partnershipmanagement.Services.PartnershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/partnerships")
public class PartnershipController {

    @Autowired
    private PartnershipService partnershipService;

    // Create a new partnership
    @PostMapping("/add")
    public ResponseEntity<Partnership> createPartnership(@RequestBody Partnership partnership) {
        Partnership newPartnership = partnershipService.createPartnership(partnership);
        return ResponseEntity.ok(newPartnership);
    }

    // Get a partnership by ID
    @GetMapping("/{id}")
    public ResponseEntity<Partnership> getPartnershipById(@PathVariable int id) {
        Partnership partnership = partnershipService.getPartnershipById(id);
        return ResponseEntity.ok(partnership);
    }

    // Get all partnerships
    @GetMapping("/all")
    public ResponseEntity<List<Partnership>> getAllPartnerships() {
        List<Partnership> partnerships = partnershipService.getAllPartnerships();
        return ResponseEntity.ok(partnerships);
    }

    // Update a partnership
    @PutMapping("/update/{id}")
    public ResponseEntity<Partnership> updatePartnership(@PathVariable int id, @RequestBody Partnership partnership) {
        Partnership updatedPartnership = partnershipService.updatePartnership(id, partnership);
        return ResponseEntity.ok(updatedPartnership);
    }

    // Delete a partnership
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePartnership(@PathVariable int id) {
        partnershipService.deletePartnership(id);
        return ResponseEntity.noContent().build();
    }

    // Delete all partnerships
    @DeleteMapping("/deleteAll")
    public ResponseEntity<Void> deleteAllPartnerships() {
        partnershipService.deleteAllPartnerships();
        return ResponseEntity.noContent().build();
    }
}