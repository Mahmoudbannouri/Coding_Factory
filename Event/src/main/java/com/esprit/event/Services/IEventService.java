package com.esprit.event.Services;

import com.esprit.event.DAO.entities.Event;
import com.esprit.event.DAO.entities.User;

import java.util.List;

public interface IEventService {
    public Event addEvent(Event event,int userID,int centreID);
    public Event updateEvent(int id,Event updatedEvent);
    public void deleteEvent(int id);
    public List<Event> getAllEvents();
    public Event getEvent(int id);
    public Event enrollToEvent(int eventID,int userID);
    public List<User> getParticipants(int eventID);
    public Event derollFromEvent(int eventID,int userID);
}
