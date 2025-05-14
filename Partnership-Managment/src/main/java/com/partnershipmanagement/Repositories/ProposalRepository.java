package com.partnershipmanagement.Repositories;

import com.partnershipmanagement.Entities.Partnership;
import com.partnershipmanagement.Entities.PartnershipStatus;
import com.partnershipmanagement.Entities.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Integer> {
    // Find proposals with end date before the given date
    List<Proposal> findByEndDateBefore(Date date);

    // Find proposals with end date after the given date
    List<Proposal> findByEndDateAfter(Date date);


    @Query("SELECT p FROM Partnership p WHERE p.proposals = :proposal")
    List<Partnership> findByProposal(@Param("proposal") Proposal proposal);

    @Query("SELECT COUNT(p) FROM Partnership p WHERE p.entreprise.idEntreprise = :entrepriseId AND p.partnershipStatus = :status")
    long countTerminatedByEntreprise(@Param("entrepriseId") int entrepriseId, @Param("status") PartnershipStatus status);

    @Query("SELECT p FROM Partnership p WHERE p.entreprise.idEntreprise = :idEntreprise")
    List<Partnership> getPartnershipsByEntrepriseId(@Param("idEntreprise") int idEntreprise);

    @Query("SELECT p FROM Partnership p WHERE p.entreprise.partnerId = :partnerId")
    List<Partnership> findByProposalEntreprisePartnerId(@Param("partnerId") Long partnerId);


}
