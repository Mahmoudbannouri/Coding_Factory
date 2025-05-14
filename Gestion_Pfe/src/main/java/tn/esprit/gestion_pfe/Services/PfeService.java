package tn.esprit.gestion_pfe.Services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.gestion_pfe.DAO.Enum.MeetingStatus;
import tn.esprit.gestion_pfe.DAO.entities.Pfe;
import tn.esprit.gestion_pfe.DAO.entities.UserDto;

import tn.esprit.gestion_pfe.DAO.repositories.PfeRepository;
import tn.esprit.gestion_pfe.Client.UserServiceClient;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.nio.file.*;
import java.util.stream.Collectors;


@Service
public class PfeService implements IPfeService {

    @Autowired
    private PfeRepository pfeRepository;

    @Autowired
    private UserServiceClient userServiceClient;


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



    @Override
    public Pfe addDocumentToPfe(long pfeId, String documentUrl) {
        Pfe pfe = pfeRepository.findById(pfeId).orElseThrow(() ->
                new RuntimeException("PFE non trouvé"));

        pfe.getDocuments().add(documentUrl);
        return pfeRepository.save(pfe);

    }


    @Override
    public List<String> getDocument(long pfeId) {
        Pfe pfe = new Pfe();
        pfe.setDocuments(pfe.getDocuments());
        return pfeRepository.findById(pfeId).orElse(null).getDocuments();
    }


    @Override
    public Pfe removeDocument(long pfeId, String documentName) {
        Pfe pfe = pfeRepository.findById(pfeId)
                .orElseThrow(() -> new RuntimeException("PFE non trouvé"));

        // Suppression en comparant les noms de fichiers seulement (sans le chemin)
        boolean removed = pfe.getDocuments().removeIf(doc ->
                doc.endsWith(documentName) ||
                        doc.contains(documentName) ||
                        extractFilename(doc).equals(documentName)
        );

        if (!removed) {
            throw new RuntimeException("Document non trouvé: " + documentName);
        }

        return pfeRepository.save(pfe); // Sauvegarde explicite
    }

    // Méthode utilitaire pour extraire le nom de fichier
    private String extractFilename(String path) {
        return path.substring(path.lastIndexOf('/') + 1);
    }
    @Override
    public Pfe uploadDocument(Long pfeId, MultipartFile file) {
        try {
            Pfe pfe = pfeRepository.findById(pfeId)
                    .orElseThrow(() -> new RuntimeException("PFE non trouvé"));

            // Création du dossier s'il n'existe pas
            Path uploadPath = Paths.get("./uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Génération d'un nom de fichier unique
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            // Sauvegarde du fichier
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Enregistrement dans la base
            String documentUrl = "/uploads/" + fileName;
            pfe.getDocuments().add(documentUrl);

            return pfeRepository.save(pfe);
        } catch (IOException e) {
            throw new RuntimeException("Échec de l'enregistrement du fichier", e);
        }
    }




    public Pfe addMeetingDate(long pfeId, Date meetingDate) {
        Pfe pfe = pfeRepository.findById(pfeId).orElse(null);
        if (pfe != null) {
            pfe.getMeetingDates().add(meetingDate);
            return pfeRepository.save(pfe);
        }
        return null;
    }

    public List<Date> getMeetingDates(long pfeId) {
        Pfe pfe = pfeRepository.findById(pfeId).orElse(null);
        if (pfe != null) {
            return pfe.getMeetingDates();
        }

        return Collections.emptyList();

    }

    @Transactional
    public Pfe removeMeetingDate(long pfeId, Date meetingDate) {
        Pfe pfe = pfeRepository.findById(pfeId)
                .orElseThrow(() -> new RuntimeException("PFE not found"));

        // Remove by comparing dates (ignoring time)
        pfe.getMeetingDates().removeIf(date ->
                isSameDay(date, meetingDate));

        return pfeRepository.save(pfe);
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


    @Override
    public List<Integer> getAllStudentIds() {
        try {
            return userServiceClient.getAllStudentIds();
        } catch (Exception e) {
            System.err.println("Error fetching student IDs: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    public List<UserDto> getAllStudents() {
        try {
            return userServiceClient.getAllStudents();
        } catch (Exception e) {
            System.err.println("Error fetching students: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    public UserDto getStudentById(Integer id) {
        try {
            return userServiceClient.getStudentById(id);
        } catch (Exception e) {
            System.err.println("Error fetching student with id " + id + ": " + e.getMessage());
            return new UserDto();
        }
    }


    @Override
    public List<Integer> getAllTrainerIds() {
        try {
            return userServiceClient.getAllTrainerIds();
        } catch (Exception e) {
            System.err.println("Error fetching trainer IDs: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    public List<UserDto> getAllTrainers() {
        try {
            return userServiceClient.getAllTrainers();
        } catch (Exception e) {
            System.err.println("Error fetching trainers: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    public UserDto getTrainerById(Integer id) {
        try {
            return userServiceClient.getTrainerById(id);
        } catch (Exception e) {
            System.err.println("Error fetching trainer with id " + id + ": " + e.getMessage());
            return  new UserDto();
        }
    }


    @Override
    public List<Integer> getAllPartnerIds() {
        try {
            return userServiceClient.getAllPartnerIds();
        } catch (Exception e) {
            System.err.println("Error fetching partner IDs: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    public List<UserDto> getAllPartners() {
        try {
            return userServiceClient.getAllPartners();
        } catch (Exception e) {
            System.err.println("Error fetching partners: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    public UserDto getPartnerById(Integer id) {
        try {
            return userServiceClient.getPartnerById(id);
        } catch (Exception e) {
            System.err.println("Error fetching partner with id " + id + ": " + e.getMessage());
            return  new UserDto();
        }
    }

    @Transactional
    public Pfe updateMeetingDate(Long pfeId, Date oldDate, Date newDate) {
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



}





