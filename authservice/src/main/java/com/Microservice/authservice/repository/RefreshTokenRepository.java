package com.Microservice.authservice.repository;

import com.Microservice.authservice.entities.RefreshToken;
import com.Microservice.authservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long> {

    Optional<RefreshToken> findByUser(User user);
    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(User user);

}
