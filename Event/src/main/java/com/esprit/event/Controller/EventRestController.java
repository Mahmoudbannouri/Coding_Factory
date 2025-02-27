package com.esprit.event.Controller;

import com.esprit.event.DAO.entities.Centre;
import com.esprit.event.DAO.entities.Event;
import com.esprit.event.DAO.entities.User;
import com.esprit.event.Services.IEventService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/event")
@CrossOrigin(origins = "http://localhost:4200")
public class EventRestController {

    @Autowired
    private IEventService eventService;

    // Add Event (Only Admins or Trainers can add)
    @PostMapping("/add/{userId}")
    public ResponseEntity<Map<String, String>> addEvent(@RequestBody Event event, @PathVariable int userId) {
        try {
            eventService.addEvent(event, userId);
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Event added successfully!");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalStateException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
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
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable int id) {
        try {
            eventService.deleteEvent(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event deleted successfully!");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (EntityNotFoundException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
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
    public ResponseEntity<Map<String, String>> enrollToEvent(@PathVariable int eventId, @PathVariable int userId) {
        try {
            eventService.enrollToEvent(eventId, userId);  // Perform the enrollment logic
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "User enrolled successfully!");
            return ResponseEntity.status(HttpStatus.OK).body(response);  // Send response with status OK
        } catch (EntityNotFoundException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);  // Send response with NOT_FOUND status
        } catch (IllegalStateException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);  // Send response with FORBIDDEN status
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
    @GetMapping("/centers")
    public ResponseEntity<List<Centre>> getAllCenters() {
        List<Centre> centers = eventService.getCenters();
        return ResponseEntity.ok(centers);
    }
}
