package tn.esprit.gestion_pfe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class GestionPfeApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionPfeApplication.class, args);
    }

}
