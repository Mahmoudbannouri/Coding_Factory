package com.partnershipmanagement.Repositories;

import com.partnershipmanagement.Entities.Entreprise;
import com.partnershipmanagement.Entities.Partnership;
import com.partnershipmanagement.Entities.PartnershipStatus;
import com.partnershipmanagement.Entities.Proposal;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface PartnershipRepository extends JpaRepository<Partnership, Integer> {

    @Query("SELECT e FROM Entreprise e WHERE e.nameEntreprise = :nameEntreprise")
    Optional<Entreprise> findByNameEntreprise(@Param("nameEntreprise") String nameEntreprise);
    @Query("SELECT p FROM Partnership p WHERE p.proposals.endDate > :currentDate")
    List<Partnership> findByEndDateAfter(@Param("currentDate") Date currentDate);

    @Query("SELECT p FROM Partnership p WHERE p.proposals.endDate < :currentDate")
    List<Partnership> findByEndDateBefore(@Param("currentDate") Date currentDate);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Proposal p, Partnership pr WHERE p.idProposal = :idProposal AND pr.partnershipStatus = :partnershipStatus")
    boolean existsByProposalIdProposalAndPartnershipStatus(@Param("idProposal") int idProposal, @Param("partnershipStatus") PartnershipStatus partnershipStatus);

    @Query("SELECT p FROM Partnership p WHERE p.proposals = :proposal")
    List<Partnership> findByProposal(@Param("proposal") Proposal proposal);

    @Query("SELECT COUNT(p) FROM Partnership p WHERE p.entreprise.idEntreprise = :entrepriseId AND p.partnershipStatus = :status")
    long countTerminatedByEntreprise(@Param("entrepriseId") int entrepriseId, @Param("status") PartnershipStatus status);
    List<Partnership> findByEntrepriseIdEntreprise(int idEntreprise);
    @EntityGraph(attributePaths = {"proposals", "entreprise", "Assesements"})
    @Query("SELECT p FROM Partnership p WHERE p.idPartnership = :id")
    Optional<Partnership> findWithAssociationsById(@Param("id") Integer id);
    @Query("SELECT p FROM Partnership p WHERE p.entreprise.idEntreprise = :idEntreprise")
    List<Partnership> getPartnershipsByEntrepriseId(@Param("idEntreprise") int idEntreprise);

    @Query("SELECT p FROM Partnership p WHERE p.entreprise.partnerId = :partnerId")
    List<Partnership> findByProposalEntreprisePartnerId(@Param("partnerId") int partnerId);
}
