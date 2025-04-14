package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Partnership;

import java.util.List;

public interface IPartnershipService {
    Partnership createPartnership(Partnership partnership);
    Partnership getPartnershipById(int id);
    List<Partnership> getAllPartnerships();
    Partnership updatePartnership(int id, Partnership partnership);
    void deletePartnership(int id);
    void deleteAllPartnerships();

    // applyForPartnership(int entrepriseId, int proposalId);
}