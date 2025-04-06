package com.Microservice.authservice.repository;


import com.Microservice.authservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {

    //Optional<User> indique que la méthode peut renvoyer un objet User s'il existe un utilisateur avec l'email spécifié,
    // ou un objet Optional vide s'il n'y a pas d'utilisateur correspondant à cet email dans la base de données.
    // Since email is unique, we'll find users by email
    Optional<User>findByEmail(String email);

    Optional<User> findByResetToken (String token);


}
