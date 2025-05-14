package com.partnershipmanagement.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import java.util.Base64;
import java.util.Map;

@Service
public class ZoomOAuthService {

    @Value("${zoom.clientId}")
    private String clientId;

    @Value("${zoom.clientSecret}")
    private String clientSecret;

    @Value("${zoom.authUrl}")
    private String authUrl;

    @Value("${zoom.apiUrl}")
    private String apiUrl;

    @Value("${zoom.redirectUri}")
    private String redirectUri;

    // Step 1: Generate the URL for Authorization Code Flow
    public String getAuthorizationUrl() {
        return "https://zoom.us/oauth/authorize?response_type=code&client_id="
                + clientId + "&redirect_uri=" + redirectUri;
    }

    // Step 2: Exchange Authorization Code for Access Token
    public String exchangeAuthorizationCodeForAccessToken(String authorizationCode) {
        RestTemplate restTemplate = new RestTemplate();

        // Prepare headers with Basic Authentication (clientId:clientSecret)
        String credentials = clientId + ":" + clientSecret;
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encodedCredentials);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Prepare body with the authorization code and redirect URI
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", authorizationCode);
        body.add("redirect_uri", redirectUri);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(apiUrl + "/oauth/token", HttpMethod.POST, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody().get("access_token").toString();
        }

        throw new RuntimeException("Failed to retrieve Zoom access token");
    }
}
