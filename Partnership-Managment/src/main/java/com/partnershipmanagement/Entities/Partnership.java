package com.partnershipmanagement.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
import java.util.Set;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
@Entity
public class Partnership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int idPartnership;
    @Getter
    @Enumerated(EnumType.STRING)
    PartnershipStatus partnershipStatus;

    public void setPartnershipStatus(PartnershipStatus partnershipStatus) {
        this.partnershipStatus = partnershipStatus;
    }

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


}
