package com.partnershipmanagement.Repositories;

import com.partnershipmanagement.Entities.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Integer> {
    // Custom query methods can be added here if needed
}