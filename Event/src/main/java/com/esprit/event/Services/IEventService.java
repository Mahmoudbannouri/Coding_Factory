package com.esprit.event.Services;

import com.esprit.event.DAO.entities.Event;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;

public interface IEventService {
    public Event addEvent(Event event,int userID) throws IOException;
    public Event updateEvent(int id,Event updatedEvent);
    public void deleteEvent(int id);
    public List<Event> getAllEvents();
    public Event getEvent(int id);
    public Event enrollToEvent(int eventID,int userID, String accessToken);
    public List<Integer> getParticipants(int eventID);
    public Event derollFromEvent(int eventID,int userID);

    public void sendMail(String toSend,String subject,String Body);
    public ResponseEntity<Resource> getEventImage(String imageUrl);
    public List<Event> getFilteredEvents(String searchQuery,
                                         String category,
                                         String startDate,
                                         String endDate,
                                         String timePeriod,
                                         Integer enrolledUserId,
                                         Integer createdBy);

    public List<Event> sortEventsByDate(List<Event> events);
    public byte[] generateICSFile(int eventID);

}
