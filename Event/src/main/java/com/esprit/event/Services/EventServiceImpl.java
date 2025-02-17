package com.esprit.event.Services;

import com.esprit.event.DAO.entities.*;
import com.esprit.event.DAO.repository.EventRepository;
import com.esprit.event.DAO.repository.ICentreRepository;
import com.esprit.event.DAO.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventServiceImpl implements IEventService{
    @Autowired
    private EventRepository eventRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ICentreRepository centreRepo;
    @Override
    public Event addEvent(Event event,int userID,int centreID) {
        User user=userRepo.findById(userID).orElse(null);
        Centre centre = centreRepo.findById(centreID).orElse(null);
        if (!(user.getRole().getName() == RoleNameEnum.ADMIN || user.getRole().getName() == RoleNameEnum.TRAINER)) {
            throw new IllegalStateException("You do not have permission to add an event. Only Admins and Trainers can add events.");
        }
        event.setEventCreator(user);

        event.setCentre(centre);
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
        eventToAttend.getParticipants().add(user);
        return eventRepo.save(eventToAttend);
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
}
