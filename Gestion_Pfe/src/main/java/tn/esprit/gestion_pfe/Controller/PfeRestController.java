package tn.esprit.gestion_pfe.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tn.esprit.gestion_pfe.DAO.entities.Pfe;
import tn.esprit.gestion_pfe.Services.IPfeService;
import tn.esprit.gestion_pfe.Services.PfeService;
import java.util.Map;
import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.util.Date;

import java.util.List;
import java.util.ArrayList;
@RestController
@RequestMapping("/api/pfe")
public class PfeRestController {
    @Autowired
    private IPfeService pfeService;


    @GetMapping("/helloPfe")
    public String sayHello() {
        return "Hello, I'm the Pfe MS";
    }

    @GetMapping
    public List<Pfe> getALL() {
        return pfeService.getAllPfe();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pfe> getPfeById(@PathVariable Long id) {
        return pfeService.getPfeById(id)
                .map(pfe -> ResponseEntity.ok(pfe))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }


    @PostMapping("/create")
    public ResponseEntity<?> createPfe(@RequestBody Pfe pfe) {
        try {
            // Validation manuelle des dates
            if (pfe.getStartDate() != null && pfe.getEndDate() != null
                    && pfe.getStartDate().after(pfe.getEndDate())) {
                return ResponseEntity.badRequest()
                        .body("La date de fin doit être postérieure à la date de début");
            }

            Pfe createdPfe = pfeService.createPfe(pfe);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPfe);
        } catch (Exception e) {
            // Log l'erreur complète
            System.err.println("Erreur lors de la création du PFE:");
            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Erreur lors de la création du PFE: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Pfe updatePfe(@PathVariable Long id, @RequestBody Pfe pfe) {
        return pfeService.updatePfe(id, pfe);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePfe(@PathVariable Long id) {
        return ResponseEntity.ok(pfeService.deletePfe(id));
    }


    // Gestion des Documents
    @PostMapping("/{pfeId}/documents")
    public Pfe addDocument(@PathVariable Long pfeId, @RequestBody String documentUrl) {
        return pfeService.addDocumentToPfe(pfeId, documentUrl);
    }

    @GetMapping("/{pfeId}/documents")
    public List<String> getDocument(@PathVariable Long pfeId) {
        return pfeService.getDocument(pfeId);
    }

    @DeleteMapping("/{pfeId}/documents")
    public Pfe removeDocument(@PathVariable Long pfeId, @RequestBody String documentName) {
        return pfeService.removeDocument(pfeId, documentName);
    }



    // Gestion des Réunions

    @PostMapping("/{pfeId}/meeting")
    public Pfe addMeetingDate(@PathVariable Long pfeId, @RequestBody  Date meetingDate) {
        return pfeService.addMeetingDate(pfeId, meetingDate);
    }

    @GetMapping("/{pfeId}/meeting")
    public List<Date> getMeetingDates(@PathVariable Long pfeId) {
        return pfeService.getMeetingDates(pfeId);
    }

    @DeleteMapping("/{pfeId}/meeting")
    public ResponseEntity<?> removeMeetingDate(
            @PathVariable Long pfeId,
            @RequestParam String meetingDate) {  // Changed from @RequestBody to @RequestParam

        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            Date date = format.parse(meetingDate);

            Pfe updatedPfe = pfeService.removeMeetingDate(pfeId, date);
            if (updatedPfe != null) {
                return ResponseEntity.ok(updatedPfe);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Format de date invalide. Utilisez le format yyyy-MM-dd");
        }
    }

    @PutMapping("/{pfeId}/meeting")
    public ResponseEntity<?> updateMeetingDate(
            @PathVariable Long pfeId,
            @RequestBody Map<String, String> requestBody) {
        try {
            String oldDateStr = requestBody.get("oldMeetingDate");
            String newDateStr = requestBody.get("newMeetingDate");

            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            Date oldDate = format.parse(oldDateStr);
            Date newDate = format.parse(newDateStr);

            Pfe updatedPfe = pfeService.updateMeetingDate(pfeId, oldDate, newDate);
            return ResponseEntity.ok(updatedPfe); // ⚠️ Vérifiez si updatedPfe est réellement sauvegardé
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Format de date invalide");
        }
    }






    // Gestion du Jury

    @PostMapping("/{pfeId}/jury")
    public Pfe addJuryMember(@PathVariable Long pfeId, @RequestBody String juryMember) {
        return pfeService.addJuryMember(pfeId, juryMember);
    }

    @GetMapping("/{pfeId}/jury")
    public List<String> getJuryMembers(@PathVariable Long pfeId) {
        return pfeService.getJuryMembers(pfeId);
    }

    @DeleteMapping("/{pfeId}/jury")
    public Pfe removeJuryMember(@PathVariable Long pfeId, @RequestBody String juryMemberName) {
        return pfeService.removeJuryMember(pfeId, juryMemberName);
    }





    
}
