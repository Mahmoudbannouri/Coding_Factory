package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Entreprise;
import com.partnershipmanagement.Repositories.EntrepriseRepository;
import com.partnershipmanagement.Repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class EntrepriseService implements IEntrepriseService {
    @Autowired
    EntrepriseRepository entrepriseRepo;
    @Autowired
    UserRepository userRepo;

    @Override
    public Entreprise createEntreprise(Entreprise ent) {
        return entrepriseRepo.save(ent);
    }

    @Override
    public void removeEntreprise(int id) {

    }

    @Override
    public List<Entreprise> getAllEntreprises() {
        return null;
    }



  /*  @Override
    public Entreprise updateEntreprise(Entreprise ent) {
        if (entrepriseRepo.existsById(ent.getIdEntreprise())) {
            return entrepriseRepo.save(ent);
        }
        throw new RuntimeException("Entreprise not found with ID: " + ent.getIdEntreprise());
    }*/

   /* @Override
    public Entreprise addEntrepriseAndAffectToUser(Entreprise ent, int idUser) {
        Optional<User> userOptional = userRepo.findById(idUser);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            ent.setPartner(user);
            return entrepriseRepo.save(ent);
        }
        throw new RuntimeException("User not found with ID: " + idUser);
    }*/


    // @Override
    public void removeAllEntreprises() {
        entrepriseRepo.deleteAll();
    }
}
