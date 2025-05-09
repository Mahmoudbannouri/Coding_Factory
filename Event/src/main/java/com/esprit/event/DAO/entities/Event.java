package com.esprit.event.DAO.entities;

import jakarta.persistence.*;
import lombok.*;
import org.attoparser.dom.Text;

import java.time.LocalDateTime;
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

    @ManyToMany
    private List<User> participants;

    @ManyToOne
    private User eventCreator;
}
