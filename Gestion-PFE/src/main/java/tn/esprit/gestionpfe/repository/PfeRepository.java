<<<<<<<< HEAD:Gestion_Pfe/src/main/java/tn/esprit/gestion_pfe/DAO/repositories/PfeRepository.java
package tn.esprit.gestion_pfe.DAO.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.gestion_pfe.DAO.entities.Pfe;
import java.util.List;
import java.util.ArrayList;
========
package tn.esprit.gestionpfe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.gestionpfe.entity.Pfe;


>>>>>>>> main:Gestion-PFE/src/main/java/tn/esprit/gestionpfe/repository/PfeRepository.java
public interface PfeRepository extends JpaRepository<Pfe, Long>{

}
