package com.partnershipmanagement.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
import java.util.List;

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

    //@NotNull(message = "Proposal name cannot be null")
   // @NotEmpty(message = "Proposal name cannot be empty")
    String proposalName;

    //@NotNull(message = "Proposal description cannot be null")
    //@NotEmpty(message = "Proposal description cannot be empty")
    String proposalDescription;

   // @NotNull(message = "Start date cannot be null")
   // @PastOrPresent(message = "Start date must be in the past or present")
    Date startDate;

   // @NotNull(message = "End date cannot be null")
   // @Future(message = "End date must be in the future")
    Date endDate;

   // @DecimalMin(value = "0.01", message = "Planned amount must be greater than 0")
    float plannedAmount;

   // @NotNull(message = "Proposal status cannot be null")
   // @NotEmpty(message = "Proposal status cannot be empty")
    String proposalStatus;

    //@NotNull(message = "Proposal type cannot be null")
  //  @NotEmpty(message = "Proposal type cannot be empty")
    String proposalType;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    User user;

    // One-to-many relationship: One Proposal can have many Applications
    @OneToMany(mappedBy = "proposals", cascade = CascadeType.ALL)
    private List<Partnership> applications;

    // Custom validation for StartDate and EndDate
    @PrePersist
    @PreUpdate
    public void validateDates() {
        if (startDate != null && endDate != null && startDate.after(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
    }
}

