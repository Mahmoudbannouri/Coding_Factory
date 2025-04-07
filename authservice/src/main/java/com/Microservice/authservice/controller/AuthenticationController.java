package com.Microservice.authservice.controller;


import com.Microservice.authservice.dao.request.SignUpRequest;
import com.Microservice.authservice.dao.request.SingninRequest;
import com.Microservice.authservice.dao.request.response.JwtAuthenticationResponse;
import com.Microservice.authservice.entities.RefreshToken;
import com.Microservice.authservice.entities.Role;
import com.Microservice.authservice.exception.TokenRefreshException;
import com.Microservice.authservice.service.AuthenticationService;
import com.Microservice.authservice.service.RefreshTokenService;
import com.Microservice.authservice.service.impl.JwtServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    private final RefreshTokenService refreshTokenService;

    private final JwtServiceImpl jwtService;

    @PostMapping("/signup")
    public ResponseEntity<JwtAuthenticationResponse> signup(@RequestBody SignUpRequest request) {
        return ResponseEntity.ok(authenticationService.SignUp(request));
    }

    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody SingninRequest request, HttpServletResponse response) {
        JwtAuthenticationResponse jwtResponse = authenticationService.SignIn(request);

        if (jwtResponse != null && jwtResponse.getToken() != null) {
            // Set the token in the response header
            response.setHeader("Access-Control-Expose-Headers", "Authorization");
            response.setHeader("Access-Control-Allow-Headers", "Authorization, X-Pingother, Origin, X-Requested-with, Content-Type, Accept, X-Custom-header");
            response.setHeader("Authorization", "Bearer " + jwtResponse.getToken());
            // Return a response with user details in the body
            JSONObject responseBody = new JSONObject();
            responseBody.put("userID", jwtResponse.getUserId());
            responseBody.put("role", jwtResponse.getRole());
            return ResponseEntity.ok(jwtResponse);
        } else {
            return ResponseEntity.badRequest().body(jwtResponse); // Assuming jwtResponse can be null
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<JwtAuthenticationResponse> refreshToken(@RequestBody Map<String,String> request){
        String refreshToken = request.get("refreshToken");
        RefreshToken token = refreshTokenService.findByToken(refreshToken).orElseThrow(
                () -> new TokenRefreshException(refreshToken,"Refresh token not found")
        );

        String newToken = jwtService.generateToken(token.getUser());

        return ResponseEntity.ok(JwtAuthenticationResponse.builder().token(newToken).refreshToken(refreshToken).build());
    }
}