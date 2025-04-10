package tn.esprit.gestionpfe.services;

import org.springframework.stereotype.Service;
import tn.esprit.gestionpfe.entity.Pfe;
import tn.esprit.gestionpfe.repository.PfeRepository;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PfeService implements IPfeService {

    private final PfeRepository pfeRepository;

    public PfeService(PfeRepository pfeRepository) {
        this.pfeRepository = pfeRepository;
    }

    public Pfe createPfe(Pfe pfe) {
        return pfeRepository.save(pfe); // Utilisation de save() pour créer un PFE
    }

    public List<Pfe> getAllPfe() {
        return pfeRepository.findAll();
    }

    public Optional<Pfe> getPfeById(Long id) {
        return pfeRepository.findById(id);
    }

    public Pfe updatePfe(Long id, Pfe updatedPfe) {
        return pfeRepository.findById(id)
                .map(pfe -> {
                    pfe.setProjectTitle(updatedPfe.getProjectTitle());
                    pfe.setDescription(updatedPfe.getDescription());
                   // pfe.setStartDate(updatedPfe.getStartDate());
                    //pfe.setEndDate(updatedPfe.getEndDate());
                   pfe.setLevel(updatedPfe.getLevel());
                    pfe.setStatus(updatedPfe.getStatus());
                   pfe.setStudentId(updatedPfe.getStudentId());
                    pfe.setTrainerId(updatedPfe.getTrainerId());
                    pfe.setEntrepriseId(updatedPfe.getEntrepriseId());
                    return pfeRepository.save(pfe);
                })
                .orElseThrow(() -> new RuntimeException("PFE non trouvé"));
    }

    public String deletePfe(Long id) {
        if (pfeRepository.findById(id).isPresent()) {
            pfeRepository.deleteById(id);
            return "PFE supprimé";
        } else {
            return "PFE Not Found";
        }
    }

    // -------------------------------------
    // CRUD POUR LES DOCUMENTS
    // -------------------------------------
    public Pfe addDocumentToPfe(Long pfeId, String documentUrl) {
        return pfeRepository.findById(pfeId).map(pfe -> {
            pfe.getDocuments().add(documentUrl);
            return pfeRepository.save(pfe);
        }).orElseThrow(() -> new RuntimeException("PFE non trouvé"));
    }

    public List<String> getDocuments(Long pfeId) {
        return pfeRepository.findById(pfeId).map(Pfe::getDocuments)
                .orElseThrow(() -> new RuntimeException("PFE non trouvé"));
    }

    public Pfe removeDocumentById(Long pfeId, Long documentId) {
        return pfeRepository.findById(pfeId).map(pfe -> {
            if (documentId < pfe.getDocuments().size()) {
                pfe.getDocuments().remove(documentId);
                return pfeRepository.save(pfe);
            } else {
                throw new RuntimeException("Document non trouvé");
            }
        }).orElseThrow(() -> new RuntimeException("PFE non trouvé"));
    }


    // -------------------------------------
    // CRUD POUR LES RÉUNIONS
    // -------------------------------------
    public Pfe addMeetingDate(Long pfeId, Date meetingDate) {
        return pfeRepository.findById(pfeId).map(pfe -> {
            pfe.getMeetingDates().add(meetingDate);
            return pfeRepository.save(pfe);
        }).orElseThrow(() -> new RuntimeException("PFE non trouvé"));
    }

    public List<java.sql.Date> getMeetingDates(Long pfeId) {
        return pfeRepository.findById(pfeId).map(pfe -> {
            List<java.sql.Date> sqlDates = new ArrayList<>();
            for (java.util.Date date : pfe.getMeetingDates()) {
                sqlDates.add(new java.sql.Date(date.getTime()));
            }
            return sqlDates;
        }).orElseThrow(() -> new RuntimeException("PFE non trouvé"));
    }

    public Pfe removeMeetingDate(Long pfeId, Long meetingId) {
        return pfeRepository.findById(pfeId).map(pfe -> {
            if (meetingId < pfe.getMeetingDates().size()) {
                pfe.getMeetingDates().remove(meetingId);
                return pfeRepository.save(pfe);
            } else {
                throw new RuntimeException("Date de réunion non trouvée");
            }
        }).orElseThrow(() -> new RuntimeException("PFE non trouvé"));
    }

    // -------------------------------------
    // CRUD POUR LE JURY
    // -------------------------------------
    public Pfe addJuryMember(Long pfeId, String juryMember) {
        return pfeRepository.findById(pfeId).map(pfe -> {
            pfe.getJuryNames().add(juryMember);
            return pfeRepository.save(pfe);
        }).orElseThrow(() -> new RuntimeException("PFE non trouvé"));
    }

    public List<String> getJuryMembers(Long pfeId) {
        return pfeRepository.findById(pfeId).map(Pfe::getJuryNames)
                .orElseThrow(() -> new RuntimeException("PFE non trouvé"));
    }

    public Pfe removeJuryMemberById(Long pfeId, Long juryMemberId) {
        return pfeRepository.findById(pfeId).map(pfe -> {
            if (juryMemberId < pfe.getJuryNames().size()) {
                pfe.getJuryNames().remove(juryMemberId);
                return pfeRepository.save(pfe);
            } else {
                throw new RuntimeException("Membre du jury non trouvé");
            }
        }).orElseThrow(() -> new RuntimeException("PFE non trouvé"));
    }
}