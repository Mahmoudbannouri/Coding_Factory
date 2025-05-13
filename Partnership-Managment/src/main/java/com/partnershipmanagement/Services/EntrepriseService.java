package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Entreprise;
import com.partnershipmanagement.Entities.Role;
import com.partnershipmanagement.Repositories.EntrepriseRepository;
import com.partnershipmanagement.Repositories.UserRepository;
import com.partnershipmanagement.dto.UserClient;
import com.partnershipmanagement.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EntrepriseService implements IEntrepriseService{
    @Autowired
    EntrepriseRepository entrepriseRepository;
    @Autowired
    UserRepository userRepository;
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

      /* @Override
        public Entreprise addEntrepriseAndAffectToUser(Entreprise ent, int idUser) {
           User user = userRepository.findById(idUser).get();
           Entreprise e = entrepriseRepository.save(ent);
           ent.setPartner(user);
           System.out.println(e.getDescriptionEntreprise());
            return e;
        }*/

    @Override
    public Entreprise addEntrepriseAndAffectToUser(Entreprise ent, int idUser) {
        UserDto user = userClient.getUserById(idUser); // Feign Client

        if (user == null) {
            throw new RuntimeException("User not found with id: " + idUser);
        }

        ent.setPartnerId(user.getId()); // <-- IMPORTANT: Set before save
        Entreprise savedEntreprise = entrepriseRepository.save(ent);

        // For enriching response
        savedEntreprise.setPartnerDto(user);
        return savedEntreprise;

    }

    @Override
    public List<Entreprise> getAllEntreprises() {
        return entrepriseRepository.findAll();
    }

    public String assignEntrepriseToUser(int idEntreprise, int idUser) {
        // 1. Fetch the user from the auth microservice using Feign
        UserDto userDto = userClient.getUserById(idUser);
        if (userDto == null) {
            return "User not found with ID: " + idUser;
        }

        // 2. Fetch the existing entreprise by ID
        Entreprise entreprise = entrepriseRepository.findById(idEntreprise)
                .orElse(null);

        if (entreprise == null) {
            return "Entreprise not found with ID: " + idEntreprise;
        }

        // 3. Set up the User entity reference with only the ID
        UserDto user = new UserDto();
        user.setId(userDto.getId());

        // 4. Assign and save
        entreprise.setPartnerDto(user);
        entreprise  .setPartnerId(user.getId());
        entrepriseRepository.save(entreprise);

        return "Entreprise with ID " + idEntreprise + " successfully assigned to user with ID " + idUser;
    }

  /*  public String assignEntrepriseToUser(String nameEnt, String cin) {
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
        //ent.setPartner(user);
      //  entrepriseRepository.save(ent);

        return "Entreprise successfully assigned to user";
    }*/

}

