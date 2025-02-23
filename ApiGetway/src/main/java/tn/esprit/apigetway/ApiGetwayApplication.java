package tn.esprit.apigetway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@EnableDiscoveryClient
@SpringBootApplication
public class ApiGetwayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGetwayApplication.class, args);
    }

//dynamique
@Bean
public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
    return builder.routes()
            .route("gestion-pfe", r -> r.path("/pfe/**")
                    .uri("lb://GESTION-PFE")) // Doit correspondre au nom du service dans Eureka
            .route("gestion-pfe", r -> r.path("/feedbacks/**")
                    .uri("lb://Gestion-PFE")) // Nouvelle route pour le microservice Feedbacks
            .build();
}

}
