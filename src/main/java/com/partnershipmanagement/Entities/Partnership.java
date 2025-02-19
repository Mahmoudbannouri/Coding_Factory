package com.partnershipmanagement.Entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter

@FieldDefaults(level = AccessLevel.PRIVATE)
public class Partnership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int idPartnership;
    float plannedAmount;
    String partnershipType;

    @ElementCollection(fetch = FetchType.EAGER) // Eagerly fetch the collection
    Set<String> agreements;
    @Enumerated(EnumType.STRING)
    PartnershipStatus partnershipStatus;
    @ManyToOne
    @JoinColumn(name = "idEntreprise", nullable = false) // Foreign key for Entreprise
    Entreprise entreprise;

    @ManyToOne
    @JoinColumn(name = "idCentre", nullable = false) // Foreign key for Centre
    Centre centre;
    @OneToOne
    Assessment assessment;

    Date startDate;

    Date endDate;

    @Override
    public String toString() {
        return "Partnership{" +
                "idPartnership=" + idPartnership +
                ", plannedAmount=" + plannedAmount +
                ", partnershipType='" + partnershipType + '\'' +
                ", partnershipStatus=" + partnershipStatus +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                '}';
    }
}
