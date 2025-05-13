package com.partnershipmanagement.Controllers;

import com.partnershipmanagement.Entities.Center;
import com.partnershipmanagement.Services.ICenterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/centers")
public class CenterController {


    @Autowired
    private ICenterService centerService;

    @PostMapping("/add")
    public ResponseEntity<Center> createCenter(@RequestBody Center center) {
        Center createdCenter = centerService.createCenter(center);
        return ResponseEntity.ok(createdCenter);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Center>> getAllCenters() {
        List<Center> centers = centerService.getAllCenters();
        return ResponseEntity.ok(centers);
    }

    @GetMapping("/getCenterById/{id}")
    public ResponseEntity<Center> getCenterById(@PathVariable int id) {
        Center center = centerService.getAllCenters().stream()
                .filter(c -> c.getIdCenter() == id)
                .findFirst()
                .orElse(null);
        if (center == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(center);
    }

    @PutMapping("/updateCenter")
    public ResponseEntity<Center> updateCenter(@PathVariable int id, @RequestBody Center center) {
        Center updatedCenter = centerService.updateCenter(id, center);
        return ResponseEntity.ok(updatedCenter);
    }

    @DeleteMapping("/deleteCenter")
    public ResponseEntity<Void> deleteCenter(@PathVariable int id) {
        centerService.removeCenter(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/assign/{userId}")
    public ResponseEntity<Center> addCenterAndAffectToUser(@RequestBody Center center, @PathVariable int userId) {
        Center createdCenter = centerService.addCenterAndAffectToUser(center, userId);
        return ResponseEntity.ok(createdCenter);
    }
}
