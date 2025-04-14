package com.partnershipmanagement.Controllers;


import com.partnershipmanagement.Entities.Entreprise;
import com.partnershipmanagement.Repositories.EntrepriseRepository;
import com.partnershipmanagement.Services.EntrepriseService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("entreprises")
@RestController

public class EntrepriseController {
    @Autowired
    private EntrepriseService serviceEntreprise;
    @Autowired
    EntrepriseRepository entrepriseRepisitory;

    // Get all entreprises
    @GetMapping("/getListEntreprise")
    public List<Entreprise> getAllEntreprises() {
        return serviceEntreprise.getAllEntreprises();
    }


    // Create a new entreprise
    @PostMapping("/add")
    public Entreprise createEntreprise(@RequestBody Entreprise ent) {
        Entreprise newEntreprise = serviceEntreprise.createEntreprise(ent);
        System.out.printf(newEntreprise.getNameEntreprise());
        return newEntreprise;
    }


    // Delete an entreprise
    @DeleteMapping("/delete/{id}")
    public Void removeEntreprise(@PathVariable int id) {
        serviceEntreprise.removeEntreprise(id);
        return null;
    }

    // Add entreprise and assign to a user
    @PostMapping("/AddEntrepriseandAssignToUser/{idUser}")
    public Entreprise addEntrepriseAndAffectToUser(@RequestBody Entreprise ent, @RequestParam int idUser) {
        return serviceEntreprise.addEntrepriseAndAffectToUser(ent, idUser);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Entreprise> updateEntreprise(@PathVariable int id, @RequestBody Entreprise ent) {
        try {
            Entreprise updatedEntreprise = serviceEntreprise.updateEntreprise(id, ent);
            return ResponseEntity.ok(updatedEntreprise); // Return 200 OK with the updated entreprise
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if entreprise does not exist
        }
    }

    @PutMapping("/assignEntrepriseToUser/{entrepriseName}/{cin}")
    public String assignEntrepriseToUser(@RequestParam String entrepriseName, @RequestParam String cin) {
        return serviceEntreprise.assignEntrepriseToUser(entrepriseName, cin);
    }

}
