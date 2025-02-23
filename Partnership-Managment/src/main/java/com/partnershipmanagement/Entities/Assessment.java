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
    Date assessmentDate;

    String feedback;
    @ElementCollection
    List<String> rules; // Use List instead of ArrayList

    @JsonIgnore
    @OneToOne
    Partnership partnership;
}
