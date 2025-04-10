package tn.esprit.gestion_pfe.Services;

import tn.esprit.gestion_pfe.DAO.Enum.MeetingStatus;

import tn.esprit.gestion_pfe.DAO.entities.Pfe;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

public interface IPfeService {


    List<Pfe> getAllPfe();

    Optional<Pfe> getPfeById(Long id);

    Pfe createPfe(Pfe pfe);

    Pfe updatePfe(long id, Pfe pfe);

    String deletePfe(long id);

    Pfe addDocumentToPfe(long pfeId, String documentUrl);

    List<String> getDocument(long pfeId);

    Pfe removeDocument(long pfeId, String documentName);

    // Add meeting date
    Pfe addMeetingDate(long pfeId, Date meetingDate);

    List<Date> getMeetingDates(long pfeId);

    Pfe removeMeetingDate(long pfeId, Date meetingDate);
    Pfe updateMeetingDate(long pfeId, Date oldDate, Date newDate);






    Pfe addJuryMember(long pfeId, String juryMember);

    List<String> getJuryMembers(long pfeId);

    Pfe removeJuryMember(long pfeId, String juryMemberName);
}
