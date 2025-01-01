package com.example.mandate_backend;

import com.example.mandate_backend.config.CorsProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        UserDetails admin = User.withUsername("admin")
            .password("{noop}secret") // {noop} means no encoder
            .roles("ADMIN")
            .build();

        // YOU MUST DEFINE THIS CFO USER
        UserDetails cfo = User.withUsername("cfo")
            .password("{noop}secret")
            .roles("CFO") 
            .build();

        // If you want a treasurer, add them here:
        UserDetails treasurer = User.withUsername("treasurer")
            .password("{noop}secret")
            .roles("TREASURER")
            .build();

        return new InMemoryUserDetailsManager(admin, cfo, treasurer);
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // 1. Enable CORS & disable CSRF
        http.cors(Customizer.withDefaults()) 
            .csrf(csrf -> csrf.disable());

        // 2. Configure which routes are permitted/authorized
        http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/hello", "/auth/**").permitAll()
            .requestMatchers("/api/mandates/**", "/api/signatories/**", "/api/rules/**","/api/workflow/**").authenticated()
            .anyRequest().authenticated()
        );

        // 3. Enable HTTP Basic
        http.httpBasic(Customizer.withDefaults());

        // Build the configuration
        return http.build();
    }

    /**
     * Creates a CORS configuration source using properties from CorsProperties.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource(CorsProperties corsProps) {
        CorsConfiguration configuration = new CorsConfiguration();

        // Setup CORS using the external config
        configuration.setAllowedOrigins(corsProps.getAllowedOrigins());
        configuration.setAllowedMethods(corsProps.getAllowedMethods());
        configuration.setAllowedHeaders(corsProps.getAllowedHeaders());
        configuration.setAllowCredentials(corsProps.isAllowCredentials());

        // You can customize other settings here if needed:
        // e.g. configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this config to all endpoints
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
