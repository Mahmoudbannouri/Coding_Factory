package tn.esprit.gestion_pfe.Services;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.gestion_pfe.DAO.Enum.MeetingStatus;
import tn.esprit.gestion_pfe.DAO.entities.Pfe;
import tn.esprit.gestion_pfe.DAO.repositories.PfeRepository;

import java.util.*;

@Service
public class PfeService implements IPfeService {

    @Autowired
    private PfeRepository pfeRepository;


    public List<Pfe> getAllPfe() {
        return pfeRepository.findAll();
    }



    public Optional<Pfe> getPfeById(Long id) {
        return pfeRepository.findById(id);
    }


    public Pfe createPfe(Pfe pfe) {
        return pfeRepository.save(pfe);
    }

    public Pfe updatePfe(long id, Pfe pfe) {
        return pfeRepository.findById(id)
                .map(existingPfe -> {
                    pfe.setId(id);
                    return pfeRepository.save(pfe);
                })
                .orElse(null);
    }

    public String deletePfe(long id) {
        pfeRepository.deleteById(id);
        return "Pfe with id " + id + " deleted successfully";
    }

    public Pfe addDocumentToPfe(long pfeId, String documentUrl) {
        Pfe pfe = pfeRepository.findById(pfeId).orElse(null);
        if (pfe != null) {
            pfe.getDocuments().add(documentUrl);
            return pfeRepository.save(pfe);
        }
        return null;
    }

    @Override
    public List<String> getDocument(long pfeId){
        Pfe pfe=new Pfe();
        pfe.setDocuments(pfe.getDocuments());
        return pfeRepository.findById(pfeId).orElse(null).getDocuments();
    }



    public Pfe removeDocument(long pfeId, String documentName) {
        Pfe pfe = pfeRepository.findById(pfeId).orElse(null);
        if (pfe != null) {
            pfe.getDocuments().remove(documentName);
            return pfeRepository.save(pfe);
        }
        return null;
    }





   public Pfe addMeetingDate(long pfeId, Date meetingDate) {
        Pfe pfe = pfeRepository.findById(pfeId).orElse(null);
       if (pfe != null) {
           if (!pfe.getMeetingDates().contains(meetingDate)) {
               pfe.getMeetingDates().add(meetingDate);
               return pfeRepository.save(pfe);
           }
       }
        return null;
    }

    public List<Date> getMeetingDates(long pfeId) {
        Pfe pfe = pfeRepository.findById(pfeId).orElse(null);
        if (pfe != null) {
            return pfe.getMeetingDates();
        }
        return  Collections.emptyList();
    }

    public Pfe removeMeetingDate(long pfeId, Date meetingDate) {
        Pfe pfe = pfeRepository.findById(pfeId).orElse(null);
        if (pfe != null) {
            boolean removed = pfe.getMeetingDates().removeIf(date -> isSameDay(date, meetingDate));
            if (removed) {
                return pfeRepository.save(pfe);
            }
        }
        return null;
    }



    @Transactional
    public Pfe updateMeetingDate(long pfeId, Date oldDate, Date newDate) {
        Pfe pfe = pfeRepository.findById(pfeId).orElse(null);
        if (pfe != null) {
            List<Date> meetingDates = pfe.getMeetingDates();
            // Recherche et remplacement de la date
            for (int i = 0; i < meetingDates.size(); i++) {
                if (isSameDay(meetingDates.get(i), oldDate)) {
                    meetingDates.set(i, newDate); // Mise à jour de la liste
                    return pfeRepository.save(pfe); // ⚠️ Sauvegarde explicite
                }
            }
        }
        return null;
    }

    // Comparer les dates sans tenir compte de l'heure
    private boolean isSameDay(Date date1, Date date2) {
        Calendar cal1 = Calendar.getInstance();
        Calendar cal2 = Calendar.getInstance();
        cal1.setTime(date1);
        cal2.setTime(date2);
        return cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR)
                && cal1.get(Calendar.DAY_OF_YEAR) == cal2.get(Calendar.DAY_OF_YEAR);
    }












  public Pfe removeJuryMember(long pfeId, String juryMemberName) {
        Pfe pfe = pfeRepository.findById(pfeId).orElse(null);
        if (pfe != null) {
            pfe.getJuryNames().remove(juryMemberName);
            return pfeRepository.save(pfe);
        }
        return null;
    }

    public Pfe addJuryMember(long pfeId, String juryMember) {
        Pfe pfe = pfeRepository.findById(pfeId).orElse(null);
        if (pfe != null) {
            pfe.getJuryNames().add(juryMember);
            return pfeRepository.save(pfe);
        }
        return null;
    }

    public List<String> getJuryMembers(long pfeId) {
        Pfe pfe = pfeRepository.findById(pfeId).orElse(null);
        if (pfe != null) {
            return pfe.getJuryNames();
        }
        return null;
    }










}
