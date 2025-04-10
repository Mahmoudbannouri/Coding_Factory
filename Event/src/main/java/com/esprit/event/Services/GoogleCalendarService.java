package com.esprit.event.Services;

import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.services.calendar.model.EventReminder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.esprit.event.DAO.entities.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

@Service
public class GoogleCalendarService {
    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.api.key}")
    private String apiKey;

    @Value("${google.api.scope}")
    private String scope;

    @Value("${google.api.application-name}")
    private String applicationName;
    private static final HttpTransport HTTP_TRANSPORT;
    private static final JacksonFactory JSON_FACTORY;

    static {
        try {
            // Initialize HTTP transport and JSON factory
            HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
            JSON_FACTORY = JacksonFactory.getDefaultInstance();
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize Google API client", e);
        }
    }

    // Method to create an event on Google Calendar
    public void createGoogleCalendarEvent(com.esprit.event.DAO.entities.Event eventToAttend, String accessToken) {
        try {
            // Set up Google API client
            GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);
            Calendar calendar = new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                    .setApplicationName(applicationName)
                    .build();

            // Build the Google Calendar event
            Event googleEvent = new Event()
                    .setSummary(eventToAttend.getEventName())
                    .setLocation(eventToAttend.getCentre().getCentreName())
                    .setDescription(eventToAttend.getEventDescription());

            LocalDateTime localDateTime = eventToAttend.getEventDate();

// Convert to ZonedDateTime with Tunisia time zone
            ZonedDateTime zonedStart = localDateTime.atZone(ZoneId.of("Africa/Tunis"));
            ZonedDateTime zonedEnd = zonedStart.plusHours(2);

// Format to ISO string with timezone
            String formattedStart = zonedStart.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
            String formattedEnd = zonedEnd.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);

// Use with Google Calendar API
            DateTime startDateTime = new DateTime(formattedStart);
            EventDateTime start = new EventDateTime().setDateTime(startDateTime).setTimeZone("Africa/Tunis");
            googleEvent.setStart(start);

            DateTime endDateTime = new DateTime(formattedEnd);
            EventDateTime end = new EventDateTime().setDateTime(endDateTime).setTimeZone("Africa/Tunis");
            googleEvent.setEnd(end);

            // Insert event into Google Calendar
            calendar.events().insert("primary", googleEvent).execute();
            System.out.println("Event created in Google Calendar.");
        } catch (Exception e) {
            System.err.println("Error creating event in Google Calendar: " + e.getMessage());
        }
    }
}

