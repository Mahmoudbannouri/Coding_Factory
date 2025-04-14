package com.esprit.event.Controller;

import com.esprit.event.DAO.entities.Event;
import com.esprit.event.Services.IEventService;
import com.esprit.event.Services.GeminiAiService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/event")
public class EventRestController {

    @Autowired
    private IEventService eventService;
    @Autowired
    private GeminiAiService geminiAIService;

    @PostMapping("/generate-description")
    public ResponseEntity<Map<String, String>> generateEventDescription(@RequestBody Event event) throws IOException {
        // Use the OpenAI service to generate a description based on the event details
        return geminiAIService.generateEventDescription(event);
    }
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
        } catch (IOException e) {
            throw new RuntimeException(e);
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

    @GetMapping("/getImage/{imageUrl}")
    public ResponseEntity<Resource> getImages(@PathVariable String imageUrl) {

        return eventService.getEventImage(imageUrl);
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
    @PostMapping("/enroll/{eventId}/{userId}/{accessToken}")
    public ResponseEntity<Map<String, String>> enrollToEvent(@PathVariable int eventId, @PathVariable int userId,@PathVariable String accessToken) {
        try {
            eventService.enrollToEvent(eventId, userId,accessToken);  // Perform the enrollment logic
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
    public ResponseEntity<List<Integer>> getParticipants(@PathVariable int eventID) {
        List<Integer> participants = eventService.getParticipants(eventID);
        return ResponseEntity.ok(participants);
    }
    @DeleteMapping("/deroll/{eventID}/{userID}")
    public ResponseEntity<Event> derollFromEvent(@PathVariable int eventID, @PathVariable int userID) {
        Event updatedEvent = eventService.derollFromEvent(eventID, userID);
        return ResponseEntity.ok(updatedEvent);
    }

    @GetMapping("/filtredEvents")
    public  List<Event> getFilteredEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String timePeriod,
            @RequestParam(required = false) Integer enrolledUserId,
            @RequestParam(required = false) Integer createdBy)
    {
        List<Event> events = eventService.getFilteredEvents(search, category, startDate, endDate, timePeriod,enrolledUserId,createdBy);

        // Sort the filtered events by date
        return eventService.sortEventsByDate(events);
    }
    @GetMapping("/download-ics/{eventId}")
    public byte[] downloadICS(@PathVariable int eventId) {
        return eventService.generateICSFile(eventId);
    }
}
