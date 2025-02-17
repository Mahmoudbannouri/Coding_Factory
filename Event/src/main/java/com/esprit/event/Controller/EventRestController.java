package com.esprit.event.Controller;

import com.esprit.event.DAO.entities.Event;
import com.esprit.event.DAO.entities.User;
import com.esprit.event.Services.IEventService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/event")
public class EventRestController {

    @Autowired
    private IEventService eventService;

    // Add Event (Only Admins or Trainers can add)
    @PostMapping("/add/{userId}/{centreID}")
    public ResponseEntity<String> addEvent(@RequestBody Event event, @PathVariable int userId,@PathVariable int centreID) {
        try {
            eventService.addEvent(event, userId,centreID);
            return ResponseEntity.status(HttpStatus.CREATED).body("Event added successfully!");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // Update Event
    @PutMapping("/update/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable int id, @RequestBody Event updatedEvent) {
        try {
            Event event = eventService.updateEvent(id, updatedEvent);
            return ResponseEntity.ok(event);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Delete Event
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable int id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.status(HttpStatus.OK).body("Event deleted successfully!");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found.");
        }
    }

    // Get All Events
    @GetMapping("/all")
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    // Get Event by ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEvent(@PathVariable int id) {
        Event event = eventService.getEvent(id);
        if (event == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(event);
    }

    // Enroll User to Event
    @PostMapping("/enroll/{eventId}/{userId}")
    public ResponseEntity<String> enrollToEvent(@PathVariable int eventId, @PathVariable int userId) {
        try {
            eventService.enrollToEvent(eventId, userId);
            return ResponseEntity.status(HttpStatus.OK).body("User enrolled successfully!");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
    @GetMapping("/{eventID}/participants")
    public ResponseEntity<List<User>> getParticipants(@PathVariable int eventID) {
        List<User> participants = eventService.getParticipants(eventID);
        return ResponseEntity.ok(participants);
    }
    @DeleteMapping("/{eventID}/deroll/{userID}")
    public ResponseEntity<Event> derollFromEvent(@PathVariable int eventID, @PathVariable int userID) {
        Event updatedEvent = eventService.derollFromEvent(eventID, userID);
        return ResponseEntity.ok(updatedEvent);
    }
}
