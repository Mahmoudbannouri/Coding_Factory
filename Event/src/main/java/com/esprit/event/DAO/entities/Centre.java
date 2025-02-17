package com.esprit.event.DAO.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class Centre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int centreID;
    private String centreName;
    private String centreDescription;

}
