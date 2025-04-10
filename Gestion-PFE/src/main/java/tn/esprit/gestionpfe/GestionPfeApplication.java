package tn.esprit.gestionpfe;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import tn.esprit.gestionpfe.Enum.PfeLevel;
import tn.esprit.gestionpfe.Enum.PfeStatus;
import tn.esprit.gestionpfe.entity.Feedback;
import tn.esprit.gestionpfe.entity.Pfe;
import tn.esprit.gestionpfe.repository.FeedbackRepository;
import tn.esprit.gestionpfe.repository.PfeRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.time.LocalDateTime;

@EnableDiscoveryClient
@SpringBootApplication
public class GestionPfeApplication {

    private final PfeRepository pfeRepository;
    private final FeedbackRepository feedbackRepository;


    public GestionPfeApplication(PfeRepository pfeRepository, FeedbackRepository feedbackRepository) {
        this.pfeRepository = pfeRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public static void main(String[] args) {
        SpringApplication.run(GestionPfeApplication.class, args);
    }


}






