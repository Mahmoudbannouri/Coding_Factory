package com.partnershipmanagement.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int idAssessment;
    float score;
    String feedback;

    @Enumerated(EnumType.STRING)
    Status status;

    @Enumerated(EnumType.STRING)
    AcceptanceStatus acceptanceStatus;

    boolean adminAcceptance;
    boolean partnerAacceptance;

    @JsonIgnore
    @ManyToOne
    Partnership partnership;
}
