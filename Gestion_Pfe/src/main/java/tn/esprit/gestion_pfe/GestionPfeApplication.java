package tn.esprit.gestion_pfe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import tn.esprit.gestion_pfe.DAO.repositories.FeedbackRepository;
import tn.esprit.gestion_pfe.DAO.repositories.PfeRepository;
import java.util.ArrayList;
import java.util.List;
@EnableDiscoveryClient
@SpringBootApplication
public class GestionPfeApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionPfeApplication.class, args);
    }

}
