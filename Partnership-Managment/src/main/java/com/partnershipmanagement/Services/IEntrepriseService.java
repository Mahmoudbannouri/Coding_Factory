package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Entreprise;

import java.util.List;

public interface IEntrepriseService {
    public Entreprise createEntreprise(Entreprise ent);
    public void removeEntreprise(int id);
    Entreprise updateEntreprise(int id, Entreprise ent);
    public Entreprise addEntrepriseAndAffectToUser(Entreprise ent, int idUser);

    List<Entreprise> getAllEntreprises();


}
