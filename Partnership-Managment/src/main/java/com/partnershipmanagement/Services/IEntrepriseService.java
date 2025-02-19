package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Entreprise;

import java.util.List;

public interface IEntrepriseService {
    public Entreprise createEntreprise(Entreprise ent);
    public void removeEntreprise(int id);
    // public Entreprise updateEntreprise(Entreprise ent);
    //public Entreprise addEntrepriseAndAffectToUser(Entreprise ent, int idUser);
    public List<Entreprise> getAllEntreprises();
    // public void removeAllEntreprises();
}
