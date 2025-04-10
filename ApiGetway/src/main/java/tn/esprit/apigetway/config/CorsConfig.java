package tn.esprit.apigetway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // Important 🔥
        config.setAllowedOrigins(Arrays.asList("http://localhost:4200", "http://localhost:3000"));
        config.addAllowedHeader("*"); // Allow All Headers
        config.addAllowedMethod("*"); // Allow All HTTP Methods (GET, POST, PUT, DELETE)
        config.addExposedHeader("Authorization"); // Optional (if you need JWT tokens)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
