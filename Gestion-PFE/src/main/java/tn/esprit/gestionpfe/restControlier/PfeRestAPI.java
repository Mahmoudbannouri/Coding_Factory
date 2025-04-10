package tn.esprit.gestionpfe.restControlier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.gestionpfe.entity.Feedback;
import tn.esprit.gestionpfe.entity.Pfe;
import tn.esprit.gestionpfe.services.PfeService;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/pfe")
public class PfeRestAPI {

    private final PfeService pfeService;

    @Autowired
    public PfeRestAPI(PfeService pfeService) {
        this.pfeService = pfeService;
    }

    @GetMapping("/helloPfe")
    public String sayHello() {
        return "Hello, I'm the Pfe MS";
    }

    @GetMapping
    public ResponseEntity<List<Pfe>> getAll() {
        return ResponseEntity.ok(pfeService.getAllPfe());
    }
//nermine
    @PostMapping("/create")
    public ResponseEntity<Pfe> createPfe(@RequestBody Pfe pfe) {
        return ResponseEntity.ok(pfeService.createPfe(pfe));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePfe(@PathVariable Long id) {
        return ResponseEntity.ok(pfeService.deletePfe(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pfe> getPfeById(@PathVariable Long id) {
        return pfeService.getPfeById(id)
                .map(pfe -> ResponseEntity.status(HttpStatus.FOUND).body(pfe))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Pfe> updatePfe(@PathVariable Long id, @RequestBody Pfe updatedPfe) {
        return ResponseEntity.ok(pfeService.updatePfe(id, updatedPfe));
    }


    // Gestion des Documents
    @PostMapping("/{pfeId}/documents")
    public ResponseEntity<Pfe> addDocument(@PathVariable Long pfeId, @RequestBody String documentUrl) {
        return new ResponseEntity<>(pfeService.addDocumentToPfe(pfeId, documentUrl), HttpStatus.CREATED);
    }

    @GetMapping("/{pfeId}/documents")
    public ResponseEntity<List<String>> getDocuments(@PathVariable Long pfeId) {
        return ResponseEntity.ok(pfeService.getDocuments(pfeId));
    }

    @DeleteMapping("/{pfeId}/documents/{documentId}")
    public ResponseEntity<Pfe> removeDocument(@PathVariable Long pfeId, @PathVariable Long documentId) {
        return ResponseEntity.ok(pfeService.removeDocumentById(pfeId, documentId));
    }

    // Gestion des Réunions
    @PostMapping("/{pfeId}/meetings")
    public ResponseEntity<Pfe> addMeeting(@PathVariable Long pfeId, @RequestBody Date meetingDate) {
        return new ResponseEntity<>(pfeService.addMeetingDate(pfeId, meetingDate), HttpStatus.CREATED);
    }

    @GetMapping("/{pfeId}/meetings")
    public ResponseEntity<List<Date>> getMeetingDates(@PathVariable Long pfeId) {
        return ResponseEntity.ok(pfeService.getMeetingDates(pfeId));
    }

    @DeleteMapping("/{pfeId}/meetings/{meetingId}")
    public ResponseEntity<Pfe> removeMeeting(@PathVariable Long pfeId, @PathVariable Long meetingId) {
        return ResponseEntity.ok(pfeService.removeMeetingDate(pfeId, meetingId));
    }

    // Gestion du Jury
    @PostMapping("/{pfeId}/jury")
    public ResponseEntity<Pfe> addJuryMember(@PathVariable Long pfeId, @RequestBody String juryMember) {
        return new ResponseEntity<>(pfeService.addJuryMember(pfeId, juryMember), HttpStatus.CREATED);
    }

    @GetMapping("/{pfeId}/jury")
    public ResponseEntity<List<String>> getJuryMembers(@PathVariable Long pfeId) {
        return ResponseEntity.ok(pfeService.getJuryMembers(pfeId));
    }

    @DeleteMapping("/{pfeId}/jury/{juryMemberId}")
    public ResponseEntity<Pfe> removeJuryMember(@PathVariable Long pfeId, @PathVariable Long juryMemberId) {
        return ResponseEntity.ok(pfeService.removeJuryMemberById(pfeId, juryMemberId));
    }
}