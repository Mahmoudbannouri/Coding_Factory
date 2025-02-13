package tn.esprit.gestionpfe;

import org.springframework.stereotype.Service;
import tn.esprit.gestionpfe.Pfe;

import java.util.List;
import java.util.Optional;

@Service
public class PfeService {

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
                    pfe.setStartDate(updatedPfe.getStartDate());
                    pfe.setEndDate(updatedPfe.getEndDate());
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
}
