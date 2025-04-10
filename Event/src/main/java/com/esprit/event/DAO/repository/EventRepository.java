package com.esprit.event.DAO.repository;

import com.esprit.event.DAO.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event,Integer> {
    @Query("SELECT e FROM Event e " +
            "WHERE (:search IS NULL OR LOWER(e.eventName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "   OR STR(e.eventDate) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:category IS NULL OR LOWER(e.eventCategory) = LOWER(:category)) " +
            "AND (:startDate IS NULL OR e.eventDate >= :startDate) " +
            "AND (:endDate IS NULL OR e.eventDate <= :endDate) " +
            "AND (" +
            "   :timePeriod IS NULL OR " +
            "   (:timePeriod = 'thisWeek' AND e.eventDate BETWEEN :startOfWeek AND :endOfWeek) OR " +
            "   (:timePeriod = 'thisMonth' AND e.eventDate BETWEEN :startOfMonth AND :endOfMonth) OR " +
            "   (:timePeriod = 'upcoming' AND e.eventDate >= :nextMonth)" +
            ")")
    List<Event> findFilteredEvents(
            @Param("search") String search,
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("timePeriod") String timePeriod,
            @Param("startOfWeek") LocalDate startOfWeek,
            @Param("endOfWeek") LocalDate endOfWeek,
            @Param("startOfMonth") LocalDate startOfMonth,
            @Param("endOfMonth") LocalDate endOfMonth,
            @Param("nextMonth") LocalDate nextMonth
    );
}
