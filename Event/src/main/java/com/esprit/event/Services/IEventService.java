package com.esprit.event.Services;

import com.esprit.event.DAO.entities.Centre;
import com.esprit.event.DAO.entities.Event;
import com.esprit.event.DAO.entities.User;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

public interface IEventService {
    public Event addEvent(Event event,int userID) throws IOException;
    public Event updateEvent(int id,Event updatedEvent);
    public void deleteEvent(int id);
    public List<Event> getAllEvents();
    public Event getEvent(int id);
    public Event enrollToEvent(int eventID,int userID, String accessToken);
    public List<User> getParticipants(int eventID);
    public Event derollFromEvent(int eventID,int userID);
    public List<Centre> getCenters();
    public void sendMail(String toSend,String subject,String Body);
    public ResponseEntity<Resource> getEventImage(String imageUrl);
    public List<Event> getFilteredEvents(String searchQuery,
                                         String category,
                                         String startDate,
                                         String endDate,
                                         String timePeriod);

    public List<Event> sortEventsByDate(List<Event> events);
}
