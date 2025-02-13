package tn.esprit.gestionpfe;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import java.util.Date;
import java.util.List;
@EnableDiscoveryClient
@SpringBootApplication
public class GestionPfeApplication {

    private final PfeRepository pfeRepository;

    public GestionPfeApplication(PfeRepository pfeRepository) {
        this.pfeRepository = pfeRepository;
    }

    public static void main(String[] args) {
        SpringApplication.run(GestionPfeApplication.class, args);
    }


    @Bean
    ApplicationRunner init() {
        return (args) -> {
            // Vérifier si des données existent déjà
            if (pfeRepository.count() == 0) {
                // Initialisation des données dans la base de données
                pfeRepository.save(new Pfe(null, "Projet A", "Description du projet A", new Date(), new Date(), PfeLevel.MASTER, PfeStatus.EN_COURS, 1L, 2L, 3L));
                pfeRepository.save(new Pfe(null, "Projet B", "Description du projet B", new Date(), new Date(), PfeLevel.INGENIEUR, PfeStatus.VALIDE, 2L, 3L, 4L));
                pfeRepository.save(new Pfe(null, "Projet C", "Description du projet C", new Date(), new Date(), PfeLevel.LICENCE, PfeStatus.REFUSE, 3L, 4L, 5L));

                // Affichage des données initialisées
                pfeRepository.findAll().forEach(pfe -> System.out.println(pfe));
            } else {
                System.out.println("Les données existent déjà !");
            }
        };
    }
}






