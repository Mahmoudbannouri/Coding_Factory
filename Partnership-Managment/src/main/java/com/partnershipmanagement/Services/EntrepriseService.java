package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.*;
import com.partnershipmanagement.Repositories.EntrepriseRepository;
import com.partnershipmanagement.Repositories.PartnershipRepository;
import com.partnershipmanagement.Repositories.UserRepository;
import com.partnershipmanagement.dto.UserDTO;
import com.partnershipmanagement.feign.UserClient;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EntrepriseService implements IEntrepriseService{
    @Autowired
    EntrepriseRepository entrepriseRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PartnershipRepository partnershipRepository;
    @Autowired
    UserClient userClient;

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

    public Entreprise addEntrepriseAndAffectToUserClient(Entreprise ent, Integer userId) {
        UserDTO user = userClient.getPartnerById(userId);
        if (user == null) throw new RuntimeException("User not found");

        ent.setPartnerId(userId);
        return entrepriseRepository.save(ent);
    }

    @Override
    public List<Entreprise> getAllEntreprises() {
        return entrepriseRepository.findAll();
    }

    public String assignEntrepriseToUser(String nameEnt, String cin) {
        Entreprise ent = entrepriseRepository.findByName(nameEnt);
        if (ent == null) {
            return "Entreprise does not exist";
        }

        // Check if the user exists
        User user = userRepository.findByCin(cin);
        if (user == null) {
            return "User does not exist";
        }

        // Check if the user has the correct role
        if (user.getRole() != Role.partner) {
            return "User is not a partner";
        }

        // Assign the entreprise to the user
        ent.setPartner(user);
        entrepriseRepository.save(ent);

        return "Entreprise successfully assigned to user";
    }
    public void checkAndBanEntreprise(int entrepriseId) {
        // Count the number of terminated partnerships
        long terminatedCount = partnershipRepository.countTerminatedByEntreprise(
                entrepriseId, PartnershipStatus.terminated
        );

        // Fetch the Entreprise
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new EntityNotFoundException("Entreprise not found"));

        // Check if the Entreprise should be banned
        if (terminatedCount > 1 || entreprise.getScoreEntreprise() < 2) {
            entreprise.setBanned(true); // Ban the Entreprise
            entrepriseRepository.save(entreprise); // Save changes
        }
    }

    public void calculateAndUpdateEntrepriseScore(int entrepriseId) {
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new RuntimeException("Entreprise not found"));

        List<Partnership> approvedPartnerships = entreprise.getPartnerships().stream()
                .filter(p -> p.getPartnershipStatus() == PartnershipStatus.Approved)
                .collect(Collectors.toList());

        if (approvedPartnerships.isEmpty()) {
            entreprise.setScoreEntreprise(0); // or keep the previous score
        } else {
            float totalScore = 0;
            for (Partnership p : approvedPartnerships) {
                totalScore += p.getScore();
            }
            float averageScore = totalScore / approvedPartnerships.size();
            entreprise.setScoreEntreprise(averageScore);
        }

        entrepriseRepository.save(entreprise);
    }
    public String getCertificationType(int entrepriseId) {
        return entrepriseRepository.findById(entrepriseId)
                .map(Entreprise::getCertificationType)
                .orElse(null);
    }

    public boolean hasSpecialization(int entrepriseId) {
        return "Specialization".equals(getCertificationType(entrepriseId));
    }

    public UserDTO getUserById(int id) {
        return userClient.getPartnerById(id);
    }

    public int getEntrepriseIdByPartnerId(int partnerId) {
        return entrepriseRepository.getEntrepriseIdByPartnerId(partnerId);
    }

}

