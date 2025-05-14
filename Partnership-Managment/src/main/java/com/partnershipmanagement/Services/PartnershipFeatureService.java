package com.partnershipmanagement.Services;

import com.partnershipmanagement.Entities.Assessment;
import com.partnershipmanagement.Entities.Entreprise;
import com.partnershipmanagement.Entities.Partnership;
import com.partnershipmanagement.Entities.Proposal;
import com.partnershipmanagement.Repositories.AssessmentRepository;
import com.partnershipmanagement.Repositories.PartnershipRepository;
import com.partnershipmanagement.Repositories.ProposalRepository;
import com.partnershipmanagement.dto.PartnershipEligibilityResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PartnershipFeatureService {
    private final AssessmentRepository assessmentRepo;
    private final ProposalService proposalService;
    private final EntrepriseService entrepriseService;
    private final PartnershipRepository partnershipRepository;

    public Double[] calculateFeatures(Partnership partnership) {
        // Validate partnership exists
        if (partnership == null) {
            throw new IllegalArgumentException("Partnership cannot be null");
        }

        // Load full partnership if needed
        Partnership fullPartnership = partnershipRepository.findWithAssociationsById(partnership.getIdPartnership())
                .orElse(partnership);

        return new Double[] {
                getAverageAssessmentScore(fullPartnership.getIdPartnership()),
                (double) getAssessmentCount(fullPartnership.getIdPartnership()),
                fullPartnership.getProposals() != null ?
                        calculateDurationGroup(fullPartnership.getProposals().getIdProposal()) : 0.0,
                fullPartnership.getEntreprise() != null ?
                        (isProfessionalCertified(fullPartnership.getEntreprise().getIdEntreprise()) ? 1.0 : 0.0) : 0.0
        };
    }


        private final RestTemplate restTemplate;
        private final String pythonApiUrl = "http://localhost:5001/predict";

    public Map<String, Object> getEligibility(Double[] features) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("your_username", "your_password"); // Match Flask credentials
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(
                Map.of("features", features),
                headers
        );

        return restTemplate.postForObject(
                pythonApiUrl,
                request,
                Map.class
        );
    }

    private boolean determineEligibility(Map<String, Object> features) {
        // Example eligibility criteria:
        // - At least 3 assessments
        // - Average score > 3
        // - Professional certification
        return ((Long)features.get("assessmentCount") >= 3) &&
                ((Double)features.get("averageScore") > 3.0) &&
                ((Boolean)features.get("isProfessionalCertified"));
    }
    private Double getAverageAssessmentScore(int partnershipId) {
        return assessmentRepo.findByPartnershipId(partnershipId).stream()
                .mapToDouble(Assessment::getScore)
                .average()
                .orElse(0.0);
    }

    private long getAssessmentCount(int partnershipId) {
        return assessmentRepo.findByPartnershipId(partnershipId).size();
    }

    private Double calculateDurationGroup(int proposalId) {
        int days = proposalService.getDurationDays(proposalId);
        return days < 7 ? 1.0 : (days < 30 ? 2.0 : 3.0);
    }

    private boolean isProfessionalCertified(int entrepriseId) {
        return "Professional".equals(entrepriseService.getCertificationType(entrepriseId));
    }
}
