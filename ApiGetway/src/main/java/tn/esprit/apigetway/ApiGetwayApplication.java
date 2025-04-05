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

    // Dynamic configuration for multiple routes
    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Route for gestion-pfe service
                .route("gestion-pfe", r -> r.path("/pfe/**")
                        .uri("lb://GESTION-PFE"))  // Ensure this matches the Eureka service name
                // Route for gestion-course service
                .route("gestion-course", r -> r.path("/gestion-course/**")
                        .uri("lb://gestion-course"))  // Ensure this matches the Eureka service name
                // Route for Spring Boot gestion-reviews service
                .route("gestion-reviews", r -> r.path("/reviews/**")
                        .uri("lb://reviews-service"))  // Ensure this matches the Eureka service name for Spring Boot reviews service
                // Route for Node.js reviews service
                // In your RouteLocator bean
                .route("reviews-service", r -> r.path("/reviews/**")
                        .uri("lb://reviews-service"))  // Must match Eureka registration exactly
                .build();// Only one .build() is needed
    }
}
