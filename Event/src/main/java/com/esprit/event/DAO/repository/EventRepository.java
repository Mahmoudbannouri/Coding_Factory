package com.esprit.event.DAO.repository;

import com.esprit.event.DAO.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event,Integer> {
}
