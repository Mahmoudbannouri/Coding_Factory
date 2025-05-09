package tn.esprit.gestion_pfe.DAO.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.gestion_pfe.DAO.entities.Pfe;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;



public interface PfeRepository extends JpaRepository<Pfe, Long>{

   /* static List<Pfe> findByPfeId(Long pfeId) {
    }

    static Page<Pfe> findByStartAfter(LocalDateTime now, Object pageable) {
    }*/

}
