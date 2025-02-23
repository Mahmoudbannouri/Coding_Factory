package com.partnershipmanagement.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
@Entity
@Getter
@Setter
public class Proposal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int idProposal;
    String proposalName;
    String proposalDescription;
    Date startDate;
    Date endDate;
    float plannedAmount;
    String proposalStatus;
    String proposalType;
    @ElementCollection(fetch = FetchType.EAGER)
    Set<String> agreements;
    @JsonIgnore
    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    User user;
    @JsonIgnore

    // One-to-many relationship: One Proposal can have many Applications
    @OneToMany(mappedBy = "proposals", cascade = CascadeType.ALL)
    private List<Partnership> applications;
    @JsonIgnore

    @ManyToOne
    Centre center;
}
