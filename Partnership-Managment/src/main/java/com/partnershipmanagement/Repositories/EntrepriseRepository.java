package com.partnershipmanagement.Repositories;

import com.partnershipmanagement.Entities.Entreprise;
import com.partnershipmanagement.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EntrepriseRepository extends JpaRepository<Entreprise,Integer> {
    @Query("SELECT e FROM Entreprise e WHERE e.nameEntreprise = :nameEntreprise")
    Entreprise findByName(@Param("nameEntreprise") String name);

}
