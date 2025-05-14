package com.partnershipmanagement.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Partnership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPartnership;

    @Enumerated(EnumType.STRING)
    private PartnershipStatus partnershipStatus;

    private float score;

    @ManyToOne

    Entreprise entreprise;

    // Many-to-one relationship: Many applications can be related to one proposal
    @ManyToOne
    @JoinColumn(name = "proposal_id",referencedColumnName = "idProposal")
    @JsonIgnoreProperties("applications")
    private Proposal proposals;


    @OneToMany(cascade = CascadeType.ALL, mappedBy="partnership")
    @ToString.Exclude
    private Set<Assessment> Assesements;




    @Transient
    private Boolean isCreditEligible;

    @Transient
    private Double creditEligibilityProbability;
}
