package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Center;

import java.util.List;

public interface ICenterService {
    Center createCenter(Center center);
    void removeCenter(int id);
    Center updateCenter(int id, Center center);
    Center addCenterAndAffectToUser(Center center, int userId);
    List<Center> getAllCenters();
}
