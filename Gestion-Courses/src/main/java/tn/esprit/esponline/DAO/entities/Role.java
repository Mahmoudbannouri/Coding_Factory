package tn.esprit.esponline.DAO.entities;


import jakarta.persistence.*;
import lombok.*;
import lombok.Getter;
import lombok.Setter;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "roles")
@Getter
@Setter
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    private RoleNameEnum name;

    public int getId() {
        return id;
    }

    public RoleNameEnum getName() {
        return name;
    }
}
