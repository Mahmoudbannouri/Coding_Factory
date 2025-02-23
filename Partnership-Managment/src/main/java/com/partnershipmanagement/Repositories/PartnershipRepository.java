package com.partnershipmanagement.Repositories;

import com.partnershipmanagement.Entities.Partnership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface PartnershipRepository extends JpaRepository<Partnership, Integer> {

    @Query("SELECT p FROM Partnership p WHERE p.proposals.endDate > :currentDate")
    List<Partnership> findByEndDateAfter(@Param("currentDate") Date currentDate);

    @Query("SELECT p FROM Partnership p WHERE p.proposals.endDate < :currentDate")
    List<Partnership> findByEndDateBefore(@Param("currentDate") Date currentDate);
}
