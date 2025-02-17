package com.esprit.event.DAO.repository;

import com.esprit.event.DAO.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Integer> {
}
