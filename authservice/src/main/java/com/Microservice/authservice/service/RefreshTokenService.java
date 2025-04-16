package com.Microservice.authservice.service;



import com.Microservice.authservice.entities.RefreshToken;
import com.Microservice.authservice.entities.User;

import java.util.Optional;

public interface RefreshTokenService {

    public RefreshToken createRefreshToken(User user);
    public Optional<RefreshToken> findByToken(String token);
    public RefreshToken verifyExpiration(RefreshToken token);
    public void deleteByUser(User user);
}
