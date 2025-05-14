package com.partnershipmanagement.Repositories;

import com.partnershipmanagement.Entities.ScrapedCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ScrapedCompaniesRepository extends JpaRepository<ScrapedCompany, Integer> {

    @Transactional
    @Modifying
    @Query("UPDATE ScrapedCompany sc SET sc.elegibilityPrecentage = 0, sc.elegible = false")
    void resetElegibilityForAll();
}
