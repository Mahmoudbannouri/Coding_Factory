package tn.esprit.gestionpfe;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.gestionpfe.Pfe;

import java.util.List;

@Repository
public interface PfeRepository extends JpaRepository<Pfe, Long>{

}






