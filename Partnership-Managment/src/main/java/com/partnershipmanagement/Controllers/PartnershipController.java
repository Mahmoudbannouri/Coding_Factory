package com.partnershipmanagement.Controllers;

import com.partnershipmanagement.Entities.Partnership;
import com.partnershipmanagement.Repositories.PartnershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/partnerships")
public class PartnershipController {

    @Autowired
    private PartnershipRepository partnershipRepository;

    @GetMapping("/all")
    public List<Partnership> getAllPartnerships() {
        return partnershipRepository.findAll();
    }
}