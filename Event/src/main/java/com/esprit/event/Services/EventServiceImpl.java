package com.esprit.event.Services;

import com.esprit.event.DAO.entities.*;
import com.esprit.event.DAO.repository.EventRepository;
import com.esprit.event.DAO.repository.ICentreRepository;
import com.esprit.event.DAO.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements IEventService{
    @Value("${upload.directory}")
    private String uploadDirectory;

    @Autowired
    private EventRepository eventRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ICentreRepository centreRepo;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private GoogleCalendarService googleCalendarService;
    private final Path uploadDir = Paths.get("/uploads");
    @Override
    public ResponseEntity<Resource> getEventImage(String imageUrl) {
        try {
            // Construct the file path
            String filePath = "uploads/" + imageUrl;
            File file = new File(filePath);

            if (!file.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Use FileSystemResource to load the file
            Resource resource = new FileSystemResource(file);

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG) // Adjust the media type if needed
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @Override
    public Event addEvent(Event event, int userID) throws IOException {
        User user = userRepo.findById(userID).orElse(null);

        if (!(user.getRole().getName() == RoleNameEnum.ADMIN || user.getRole().getName() == RoleNameEnum.TRAINER)) {
            throw new IllegalStateException("You do not have permission to add an event. Only Admins and Trainers can add events.");
        }
        if (event.getImageUrl() != null && !event.getImageUrl().isEmpty()) {
            String imageUrl = saveBase64Image(event.getImageUrl());
            event.setImageUrl(imageUrl);
        }
        // Set the event creator
        event.setEventCreator(user);

        // The imageUrl is already part of the event object passed in the request body
        return eventRepo.save(event);
    }
    private String saveBase64Image(String base64Image) throws IOException {
        if (base64Image == null || base64Image.isEmpty()) {
            throw new IllegalArgumentException("Base64 image string is empty or null.");
        }

        // Check if the base64 string has the expected prefix
        if (!base64Image.startsWith("data:image/")) {
            throw new IllegalArgumentException("Invalid base64 image format. Expected 'data:image/...;base64,' prefix.");
        }

        // Extract the base64 data (remove the "data:image/...;base64," prefix)
        String[] parts = base64Image.split(",");
        if (parts.length < 2) {
            throw new IllegalArgumentException("Invalid base64 image format. Could not split the string.");
        }
        String base64Data = parts[1];

        // Decode the base64 string
        byte[] imageBytes;
        try {
            imageBytes = Base64.getDecoder().decode(base64Data);
        } catch (IllegalArgumentException e) {
            throw new IOException("Failed to decode base64 image string.", e);
        }

        // Save the file
        String uploadDir = "uploads/";
        File uploadPath = new File(uploadDir);

        if (!uploadPath.exists()) {
            if (!uploadPath.mkdirs()) {
                throw new IOException("Failed to create upload directory: " + uploadDir);
            }
        }

        // Generate a unique file name
        String fileName = UUID.randomUUID().toString() + ".png";
        File file = new File(uploadPath, fileName);

        try {
            Files.write(file.toPath(), imageBytes);
        } catch (IOException e) {
            throw new IOException("Failed to write image file: " + file.getAbsolutePath(), e);
        }

        return fileName;
    }
    @Override
    public Event updateEvent(int id, Event updatedEvent) {

        return eventRepo.findById(id).map(existingEvent -> {
            existingEvent.setEventName(updatedEvent.getEventName());
            existingEvent.setEventDescription(updatedEvent.getEventDescription());
            existingEvent.setEventDate(updatedEvent.getEventDate());
            existingEvent.setEventCategory(updatedEvent.getEventCategory());

            // Update the image URL if provided
            if (updatedEvent.getImageUrl() != null && !updatedEvent.getImageUrl().isEmpty()) {
                // Only update the image URL if it's different
                if (!existingEvent.getImageUrl().equals(updatedEvent.getImageUrl())) {
                    try {
                        existingEvent.setImageUrl(saveBase64Image(updatedEvent.getImageUrl()));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            }

            // Fetch and set the Centre entity
            Centre centre = centreRepo.findById(updatedEvent.getCentre().getCentreID())
                    .orElseThrow(() -> new EntityNotFoundException("Centre with ID " + updatedEvent.getCentre().getCentreID() + " not found"));
            existingEvent.setCentre(centre);

            // Fetch and set the User entity for eventCreator
            User eventCreator = userRepo.findById(updatedEvent.getEventCreator().getId())
                    .orElseThrow(() -> new EntityNotFoundException("User with ID " + updatedEvent.getEventCreator().getId() + " not found"));
            existingEvent.setEventCreator(eventCreator);

            // Update participants if necessary
            existingEvent.setParticipants(updatedEvent.getParticipants());

            return eventRepo.save(existingEvent); // ✅ Save changes
        }).orElseThrow(() -> new EntityNotFoundException("Event with ID " + id + " not found"));
    }

    @Override
    public void deleteEvent(int id) {
        if(eventRepo.findById(id).isPresent())
        {
            eventRepo.deleteById(id);
        }
    }
    public List<Event> sortEventsByDate(List<Event> events) {
        LocalDateTime now = LocalDateTime.now();

        // Sort the events based on proximity to current date
        return events.stream()
                .sorted((a, b) -> {
                    // Get the difference in milliseconds for event A and event B
                    long diffA = ChronoUnit.MILLIS.between(now, a.getEventDate());
                    long diffB = ChronoUnit.MILLIS.between(now, b.getEventDate());

                    // Sorting logic: future first, closest events first, then past events most recent
                    if (diffA >= 0 && diffB >= 0) {
                        return Long.compare(diffA, diffB); // Future events: closest first
                    } else if (diffA < 0 && diffB < 0) {
                        return Long.compare(Math.abs(diffB), Math.abs(diffA)); // Past events: most recent first
                    } else {
                        return diffA >= 0 ? -1 : 1; // Future before past
                    }
                })
                .collect(Collectors.toList());
    }
    @Override
    public List<Event> getAllEvents() {

        List<Event> events = eventRepo.findAll();
        return sortEventsByDate(events);
    }

    @Override
    public Event getEvent(int id) {
        Event event=new Event();
        if(eventRepo.findById(id).isPresent())
        {
            event= eventRepo.findById(id).orElse(null);
        }
        return event;
    }

    @Override
    public Event enrollToEvent(int eventID, int userID, String accessToken) {
        Event eventToAttend= eventRepo.findById(eventID)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
        User user = userRepo.findById(userID)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        if (eventToAttend.getParticipants().contains(user)) {
            throw new IllegalStateException("User is already enrolled in this event.");
        }
        else{
        eventToAttend.getParticipants().add(user);
        googleCalendarService.createGoogleCalendarEvent(eventToAttend,accessToken);
        String subject = "Welcome to the " + eventToAttend.getEventName() + "!";
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        String eventDate = eventToAttend.getEventDate().format(dateFormatter);
        String eventTime = eventToAttend.getEventDate().format(timeFormatter);

        String body = "Hi " + user.getName() + ",</p>"
                + "Welcome to the event: <strong>" + eventToAttend.getEventName() + "</strong>!</p>"
                + "<p>We are excited to have you join us. Here are the details of the event:</p>"
                + "<p><strong>Event Name:</strong> " + eventToAttend.getEventName() + "</p>"
                + "<p><strong>Event Date:</strong> " + eventDate + "</p>"
                + "<p><strong>Event Time:</strong> " + eventTime + "</p>"
                + "<p>Thank you for enrolling!</p>";
        sendMail(user.getEmail(),subject,body);

        return eventRepo.save(eventToAttend);}
    }

    @Override
    public List<User> getParticipants(int eventID) {
        Event event=eventRepo.findById(eventID).orElseThrow(() -> new EntityNotFoundException("Event not found"));
        return event.getParticipants();
    }

    @Override
    public Event derollFromEvent(int eventID, int userID) {
        Event eventToDeroll= eventRepo.findById(eventID)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
        User user = userRepo.findById(userID)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        if (!eventToDeroll.getParticipants().contains(user)) {
            throw new IllegalStateException("User is not enrolled in this event.");
        }
        eventToDeroll.getParticipants().remove(user);
        return eventRepo.save(eventToDeroll);
    }

    @Override
    public List<Centre> getCenters() {
        return centreRepo.findAll();
    }

    @Override
    public void sendMail(String toSend, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("kedidiselim2@gmail.com");
            helper.setTo(toSend);
            helper.setSubject(subject);
            helper.setText(body, true); // The 'true' flag enables HTML content

            mailSender.send(message);
            System.out.println("Mail sent successfully!");

        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    LocalDateTime now = LocalDateTime.now();
    public List<Event> getFilteredEvents(
            String search,
            String category,
            String startDate,
            String endDate,
            String timePeriod) {

        List<Event> allEvents = eventRepo.findAll();
        LocalDate now = LocalDate.now();

        return allEvents.stream()
                .filter(event -> matchesSearch(event, search))
                .filter(event -> matchesCategory(event, category))
                .filter(event -> matchesDateRange(event, startDate, endDate))
                .filter(event -> matchesTimePeriod(event, timePeriod, now.atStartOfDay()))
                .collect(Collectors.toList());
    }


    private boolean matchesSearch(Event event, String searchQuery) {
        if (searchQuery == null || searchQuery.isEmpty()) {
            return true;
        }
        String query = searchQuery.toLowerCase();
        return event.getEventName().toLowerCase().contains(query) ||
                event.getEventDate().toString().toLowerCase().contains(query);
    }

    private boolean matchesCategory(Event event, String category) {
        if (category == null || category.isEmpty()) {
            return true;
        }

        try {
            // Try to match the enum value if provided
            Category categoryEnum = Category.valueOf(category.toUpperCase());
            return event.getEventCategory() == categoryEnum;
        } catch (IllegalArgumentException e) {
            // If category string doesn't match enum exactly, do partial match
            return event.getEventCategory().toString().toLowerCase().contains(category.toLowerCase());
        }
    }

    private boolean matchesDateRange(Event event, String startDate, String endDate) {
        if ((startDate == null || startDate.isEmpty()) &&
                (endDate == null || endDate.isEmpty())) {
            return true;
        }

        LocalDateTime eventDateTime = event.getEventDate();
        LocalDate eventDate = eventDateTime.toLocalDate();

        boolean afterStartDate = true;
        if (startDate != null && !startDate.isEmpty()) {
            LocalDate rangeStart = LocalDate.parse(startDate, formatter);
            // Convert to LocalDateTime with start of day for comparison
            LocalDateTime rangeStartDateTime = rangeStart.atStartOfDay();
            afterStartDate = !eventDateTime.isBefore(rangeStartDateTime);
        }

        boolean beforeEndDate = true;
        if (endDate != null && !endDate.isEmpty()) {
            LocalDate rangeEnd = LocalDate.parse(endDate, formatter);
            // Convert to LocalDateTime with end of day for comparison
            LocalDateTime rangeEndDateTime = rangeEnd.atTime(LocalTime.MAX);
            beforeEndDate = !eventDateTime.isAfter(rangeEndDateTime);
        }

        return afterStartDate && beforeEndDate;
    }

    private boolean matchesTimePeriod(Event event, String timePeriod, LocalDateTime now) {
        if (timePeriod == null || timePeriod.isEmpty()) {
            return true;
        }

        LocalDateTime eventDateTime = event.getEventDate();
        LocalDate eventDate = eventDateTime.toLocalDate();
        LocalDate today = now.toLocalDate();

        switch (timePeriod.toLowerCase()) {
            case "thisweek":
                LocalDate endOfWeek = today.plusDays(7 - today.getDayOfWeek().getValue());
                return !eventDate.isBefore(today) && !eventDate.isAfter(endOfWeek);
            case "thismonth":
                LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());
                return !eventDate.isBefore(today) && !eventDate.isAfter(endOfMonth);
            case "upcoming":
                return !eventDateTime.isBefore(now);
            default:
                return true;
        }
    }
}
