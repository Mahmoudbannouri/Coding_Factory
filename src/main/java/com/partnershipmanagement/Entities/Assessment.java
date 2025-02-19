package com.partnershipmanagement.Entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.Date;

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
    Date assessmentDate;

    String feedback;
    @ElementCollection
    ArrayList<String>
    rules = new ArrayList<>();
    @OneToOne
    Partnership partnership;
}
