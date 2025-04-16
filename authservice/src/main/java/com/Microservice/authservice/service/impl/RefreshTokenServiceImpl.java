package com.Microservice.authservice.service.impl;


import com.Microservice.authservice.entities.RefreshToken;
import com.Microservice.authservice.entities.User;
import com.Microservice.authservice.exception.TokenRefreshException;
import com.Microservice.authservice.repository.RefreshTokenRepository;
import com.Microservice.authservice.repository.UserRepository;

import com.Microservice.authservice.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    @Value("${jwt.refresh.expirationMs}")
    private Long refreshTokenDuration;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Override
    public RefreshToken createRefreshToken(User user) {

        Optional<RefreshToken> existingToken = refreshTokenRepository.findByUser(user);

        RefreshToken refreshToken;
        if (existingToken.isPresent()) {
            refreshToken = existingToken.get();
            refreshToken.setToken(UUID.randomUUID().toString());
            refreshToken.setExpirydate(Instant.now().plusMillis(refreshTokenDuration));
        } else {
            refreshToken = new RefreshToken();
            refreshToken.setUser(user);
            refreshToken.setToken(UUID.randomUUID().toString());
            refreshToken.setExpirydate(Instant.now().plusMillis(refreshTokenDuration));
        }

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if(token.getExpirydate().isBefore(Instant.now())){
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(),"Refresh token expired");
        }
        return token;
    }

    @Override
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
