package com.Microservice.authservice.service;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {

    String extractUserName(String token);

    //Cette méthode est utilisée pour générer un jeton JWT. Elle prend un nom d'utilisateur en entrée,
    // crée un ensemble de claims  (e.g., subject, issued-at, expiration,
    // puis construit un jeton JWT en utilisant les claims et la clé de signature. Le jeton résultant est renvoyé
     String generateToken(UserDetails userDetails);

    boolean isTokenValid(String token, UserDetails userDetails);
}
