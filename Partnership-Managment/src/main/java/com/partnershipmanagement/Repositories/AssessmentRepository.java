package com.partnershipmanagement.Repositories;

import com.partnershipmanagement.Entities.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Integer> {
    @Query("SELECT a FROM Assessment a WHERE a.partnership.idPartnership = :partnershipId")
    List<Assessment> findByPartnershipId(@Param("partnershipId") int partnershipId);
    @Query("SELECT COUNT(a) FROM Assessment a WHERE a.partnership.idPartnership = :partnershipId")
    long countByPartnershipId(@Param("partnershipId") int partnershipId);
}
