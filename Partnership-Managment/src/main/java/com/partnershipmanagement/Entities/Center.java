package com.partnershipmanagement.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicUpdate;

@DynamicUpdate
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Getter
@Setter
public class Center {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int idCenter;

    @Column(unique = true, nullable = false)
    String nameCenter;

    String descriptionCenter;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
}
