package tn.esprit.gestion_pfe.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.gestion_pfe.Client.UserServiceClient;
import tn.esprit.gestion_pfe.DAO.entities.Pfe;
import tn.esprit.gestion_pfe.DAO.entities.UserDto;
import tn.esprit.gestion_pfe.Services.IPfeService;
import tn.esprit.gestion_pfe.Services.PfeService;


import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/pfe")
public class PfeRestController {
    @Autowired
    public IPfeService pfeService;

    @Autowired
    public UserServiceClient userServiceClient;


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
    public ResponseEntity<Pfe> addDocument(
            @PathVariable Long pfeId,
            @RequestBody Map<String, String> request) {

        String documentUrl = request.get("url");
        if (documentUrl == null || documentUrl.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Pfe updatedPfe = pfeService.addDocumentToPfe(pfeId, documentUrl);
        return ResponseEntity.ok(updatedPfe);
    }

    @GetMapping("/{pfeId}/documents")
    public List<String> getDocument(@PathVariable Long pfeId) {
        return pfeService.getDocument(pfeId);
    }

    @DeleteMapping("/{pfeId}/documents")
    public Pfe removeDocument(
            @PathVariable Long pfeId,
            @RequestBody String documentName) {

        System.out.println("Document à supprimer reçu: " + documentName);
        return pfeService.removeDocument(pfeId, documentName.trim()); // Ajout de trim() pour supprimer les espaces
    }
    @PostMapping(value = "/{pfeId}/documents/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadDocument(
            @PathVariable Long pfeId,
            @RequestParam("file") MultipartFile file) {

        try {
            Pfe updatedPfe = pfeService.uploadDocument(pfeId, file);
            return ResponseEntity.ok(updatedPfe);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // Gestion des Réunions

    @PostMapping("/{pfeId}/meeting")
    public Pfe addMeetingDate(@PathVariable Long pfeId, @RequestBody Date meetingDate) {
        return pfeService.addMeetingDate(pfeId, meetingDate);
    }

    @GetMapping("/{pfeId}/meeting")
    public List<Date> getMeetingDates(@PathVariable Long pfeId) {
        return pfeService.getMeetingDates(pfeId);
    }

    @DeleteMapping("/{pfeId}/meeting")
    public Pfe removeMeetingDate(
            @PathVariable Long pfeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date meetingDate) {
        return pfeService.removeMeetingDate(pfeId, meetingDate);
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
    /*@GetMapping("/pfe/{pfeId}")
    public List<MeetingResponse> getPfeMeetings(@PathVariable Long pfeId) {
        return pfeService.getPfeMeetings(pfeId).stream()
                .map(meetingMapper::toResponse)
                .collect(Collectors.toList());
    }*/






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


    // Endpoints pour les IDs
    @GetMapping("/students/ids")
    public ResponseEntity<?> getAllStudentIds() {
        try {
            List<Integer> studentIds = pfeService.getAllStudentIds();
            return ResponseEntity.ok(studentIds);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("User service is unavailable");
        }
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        try {
            List<UserDto> students = pfeService.getAllStudents();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("User service is unavailable");
        }
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Integer id) {
        try {
            UserDto student = pfeService.getStudentById(id);
            return ResponseEntity.ok(student);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Student not found or user service is unavailable");
        }
    }


    @GetMapping("/trainers/ids")
    public ResponseEntity<?> getAllTrainerIds() {
        try {
            List<Integer> trainerIds = pfeService.getAllTrainerIds();
            return ResponseEntity.ok(trainerIds);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("User service is unavailable");
        }
    }

    @GetMapping("/trainers")
    public ResponseEntity<?> getAllTrainers() {
        try {
            List<UserDto> trainers = pfeService.getAllTrainers();
            return ResponseEntity.ok(trainers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("User service is unavailable");
        }
    }

    @GetMapping("/trainers/{id}")
    public ResponseEntity<?> getTrainerById(@PathVariable Integer id) {
        try {
            UserDto trainer = pfeService.getTrainerById(id);
            return ResponseEntity.ok(trainer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Trainer not found or user service is unavailable");
        }
    }


    @GetMapping("/partners/ids")
    public ResponseEntity<?> getAllPartnerIds() {
        try {
            List<Integer> partnerIds = pfeService.getAllPartnerIds();
            return ResponseEntity.ok(partnerIds);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("User service is unavailable");
        }
    }

    @GetMapping("/partners")
    public ResponseEntity<?> getAllPartners() {
        try {
            List<UserDto> partners = pfeService.getAllPartners();
            return ResponseEntity.ok(partners);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("User service is unavailable");
        }
    }

    @GetMapping("/partners/{id}")
    public ResponseEntity<?> getPartnerById(@PathVariable Integer id) {
        try {
            UserDto partner = pfeService.getPartnerById(id);
            return ResponseEntity.ok(partner);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Partner not found or user service is unavailable");
        }
    }
}

