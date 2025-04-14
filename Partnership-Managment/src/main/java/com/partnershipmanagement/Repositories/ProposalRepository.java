package com.partnershipmanagement.Repositories;

import com.partnershipmanagement.Entities.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Integer> {
    // Find proposals with end date before the given date
    List<Proposal> findByEndDateBefore(Date date);

    // Find proposals with end date after the given date
    List<Proposal> findByEndDateAfter(Date date);
}
