package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Entreprise;
import com.partnershipmanagement.Entities.User;
import com.partnershipmanagement.Repositories.EntrepriseRepository;
import com.partnershipmanagement.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EntrepriseService implements IEntrepriseService{
    @Autowired
    EntrepriseRepository entrepriseRepository;
    @Autowired
    UserRepository userRepository;

    @Override
    public Entreprise createEntreprise(Entreprise ent) {
        return entrepriseRepository.save(ent);
    }

    @Override
    public void removeEntreprise(int id) {
        entrepriseRepository.deleteById(id);
    }

    @Override
    public Entreprise updateEntreprise(int id, Entreprise ent) {
        Entreprise existingEntreprise = entrepriseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entreprise not found with ID: " + id));

        // Update only non-null fields from the request body
        if (ent.getNameEntreprise() != null) existingEntreprise.setNameEntreprise(ent.getNameEntreprise());
        if (ent.getAddressEntreprise() != null) existingEntreprise.setAddressEntreprise(ent.getAddressEntreprise());
        if (ent.getDescriptionEntreprise() != null) existingEntreprise.setDescriptionEntreprise(ent.getDescriptionEntreprise());
        if (ent.getEmailEntreprise() != null) existingEntreprise.setEmailEntreprise(ent.getEmailEntreprise());
        if (ent.getPhoneEntreprise() != null) existingEntreprise.setPhoneEntreprise(ent.getPhoneEntreprise());

        // Save the updated entreprise
        return entrepriseRepository.save(existingEntreprise);
    }

   @Override
    public Entreprise addEntrepriseAndAffectToUser(Entreprise ent, int idUser) {
       User user = userRepository.findById(idUser).get();
       Entreprise e = entrepriseRepository.save(ent);
       ent.setPartner(user);
       System.out.println(e.getDescriptionEntreprise());
        return e;
    }

    @Override
    public List<Entreprise> getAllEntreprises() {
        return entrepriseRepository.findAll();
    }

    }

