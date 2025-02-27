package com.esprit.event.Services;

import com.esprit.event.DAO.entities.*;
import com.esprit.event.DAO.repository.EventRepository;
import com.esprit.event.DAO.repository.ICentreRepository;
import com.esprit.event.DAO.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EventServiceImpl implements IEventService{
    @Autowired
    private EventRepository eventRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ICentreRepository centreRepo;
    @Autowired
    private JavaMailSender mailSender;
    @Override
    public Event addEvent(Event event,int userID) {
        User user=userRepo.findById(userID).orElse(null);

        if (!(user.getRole().getName() == RoleNameEnum.ADMIN || user.getRole().getName() == RoleNameEnum.TRAINER)) {
            throw new IllegalStateException("You do not have permission to add an event. Only Admins and Trainers can add events.");
        }
        event.setEventCreator(user);


        return eventRepo.save(event);
    }

    @Override
    public Event updateEvent(int id, Event updatedEvent) {
        return eventRepo.findById(id).map(existingEvent -> {
            existingEvent.setEventName(updatedEvent.getEventName());
            existingEvent.setEventDescription(updatedEvent.getEventDescription());
            existingEvent.setEventDate(updatedEvent.getEventDate());
            existingEvent.setEventCategory(updatedEvent.getEventCategory());

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

    @Override
    public List<Event> getAllEvents() {
        return eventRepo.findAll();
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
    public Event enrollToEvent(int eventID, int userID) {
        Event eventToAttend= eventRepo.findById(eventID)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
        User user = userRepo.findById(userID)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        if (eventToAttend.getParticipants().contains(user)) {
            throw new IllegalStateException("User is already enrolled in this event.");
        }
        else{
        eventToAttend.getParticipants().add(user);
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
}
