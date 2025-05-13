package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Center;
import com.partnershipmanagement.Entities.Role;
import com.partnershipmanagement.Entities.User;
import com.partnershipmanagement.Repositories.CenterRepository;
import com.partnershipmanagement.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CenterService implements ICenterService {
    @Autowired
    CenterRepository centerRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    public Center createCenter(Center center) {
        return centerRepository.save(center);
    }

    @Override
    public void removeCenter(int id) {
        centerRepository.deleteById(id);
    }

    @Override
    public Center updateCenter(int id, Center center) {
        Center existingCenter = centerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Center not found with ID: " + id));

        // Update only non-null fields from the request body
        if (center.getNameCenter() != null) existingCenter.setNameCenter(center.getNameCenter());
        if (center.getDescriptionCenter() != null) existingCenter.setDescriptionCenter(center.getDescriptionCenter());

        // Save the updated center
        return centerRepository.save(existingCenter);
    }

    @Override
    public Center addCenterAndAffectToUser(Center center, int userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        Center savedCenter = centerRepository.save(center);
        savedCenter.setUser(user);
        return savedCenter;
    }

    @Override
    public List<Center> getAllCenters() {
        return centerRepository.findAll();
    }

    public String assignCenterToUser(String nameCenter, String cin) {
        Center center = centerRepository.findByName(nameCenter);
        if (center == null) {
            return "Center does not exist";
        }

        // Check if the user exists
        User user = userRepository.findByCin(cin);
        if (user == null) {
            return "User does not exist";
        }

        // Check if the user has the correct role
        if (user.getRole() != Role.partner) {
            return "User is not a partner";
        }

        // Assign the center to the user
        center.setUser(user);
        centerRepository.save(center);

        return "Center successfully assigned to user";
    }
}
