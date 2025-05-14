package tn.esprit.gestion_pfe.DAO.repositories;

import feign.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import tn.esprit.gestion_pfe.DAO.entities.Pfe;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

public interface PfeRepository extends JpaRepository<Pfe, Long>{
  @Query("SELECT p FROM Pfe p LEFT JOIN FETCH p.meetingDates WHERE p.id = :id")
  Optional<Pfe> findByIdWithMeetingDates(@Param("id") Long id);
 }
