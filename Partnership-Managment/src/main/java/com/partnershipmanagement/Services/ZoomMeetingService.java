package com.partnershipmanagement.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import java.util.HashMap;
import java.util.Map;

@Service
public class ZoomMeetingService {
// used rest client instead of rest template cuz of sync and async problems

    @Value("${zoom.apiUrl}")
    private String zoomApiUrl;

    private final RestClient restClient;

    // Constructor-based injection for RestClient
    public ZoomMeetingService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    // Update the method to accept accessToken as a parameter
    public String createMeeting(String topic, String startTime, int duration, String accessToken) {
        String createMeetingUrl = zoomApiUrl + "/users/me/meetings";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken); // Use the access token passed as a parameter

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("topic", topic);
        requestBody.put("type", 2); // Scheduled meeting
        requestBody.put("start_time", startTime); // Format: "yyyy-MM-dd'T'HH:mm:ss'Z'"
        requestBody.put("duration", duration);
        requestBody.put("timezone", "UTC");

        Map<String, Object> settings = new HashMap<>();
        settings.put("host_video", true);
        settings.put("participant_video", true);
        settings.put("mute_upon_entry", true);
        settings.put("waiting_room", false);
        requestBody.put("settings", settings);

        // Make the POST request using RestClient
        Map<String, Object> response = restClient.post()
                .uri(createMeetingUrl)
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        if (response != null && response.containsKey("join_url")) {
            return response.get("join_url").toString();
        }

        throw new RuntimeException("Failed to create Zoom meeting");
    }
}
