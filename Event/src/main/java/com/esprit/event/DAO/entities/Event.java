package com.esprit.event.DAO.entities;

import jakarta.persistence.*;
import lombok.*;
import org.attoparser.dom.Text;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Setter
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idEvent;
    private String eventName;

    private String eventDescription;
    private LocalDateTime eventDate;
    @Enumerated(EnumType.STRING)
    private Category eventCategory;
    private String imageUrl;
    @ManyToOne
    private Centre centre;

    // Proper mapping for participant IDs
    @ElementCollection
    @CollectionTable(
            name = "event_participants",
            joinColumns = @JoinColumn(name = "event_id")
    )
    @Column(name = "user_id")  // This matches the column in your join table
    private List<Integer> participants = new ArrayList<>();  // Initialize to avoid NPE
    private Integer eventCreator;
}
