package com.partnershipmanagement.Repositories;

import com.partnershipmanagement.Entities.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Integer> {

}
