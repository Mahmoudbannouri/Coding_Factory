package com.partnershipmanagement.Repositories;

import com.partnershipmanagement.Entities.Entreprise;
import com.partnershipmanagement.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntrepriseRepository extends JpaRepository<Entreprise,Integer> {
}
