package tn.esprit.gestionpfe.services;

import tn.esprit.gestionpfe.entity.Pfe;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

public interface IPfeService {

        Pfe createPfe(Pfe pfe);
        List<Pfe> getAllPfe();
        Optional<Pfe> getPfeById(Long id);
        Pfe updatePfe(Long id, Pfe updatedPfe);
        String deletePfe(Long id);

        // Gestion des Documents
        Pfe addDocumentToPfe(Long pfeId, String documentUrl);
        List<String> getDocuments(Long pfeId);
        Pfe removeDocumentById(Long pfeId, Long documentId);

        // Gestion des Réunions
        Pfe addMeetingDate(Long pfeId, Date meetingDate);
        List<Date> getMeetingDates(Long pfeId);
        Pfe removeMeetingDate(Long pfeId, Long meetingId);

        // Gestion du Jury
        Pfe addJuryMember(Long pfeId, String juryMember);
        List<String> getJuryMembers(Long pfeId);
        Pfe removeJuryMemberById(Long pfeId, Long juryMemberId);
}
