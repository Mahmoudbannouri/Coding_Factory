package com.partnershipmanagement.Controllers;

import com.partnershipmanagement.Entities.Entreprise;
import com.partnershipmanagement.Repositories.EntrepriseRepository;
import com.partnershipmanagement.Services.EntrepriseService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("entreprises")
@RestController
public class EntrepriseController {
    @Autowired
    private EntrepriseService entrepriseService;
    @Autowired
    EntrepriseRepository entrepriseRepo;
    @PostMapping("/add")
    public Entreprise createEntreprise(@RequestBody Entreprise ent) {
        Entreprise newEntreprise = entrepriseService.createEntreprise(ent);
        return newEntreprise;
    }
}
