package com.viniciuskz.anonymousstories.config;

import com.viniciuskz.anonymousstories.service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${app.cors.allowed-origins}")
    private List <String> setAllowedOrigins;

    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService){
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // NOVO: sem isso, o Spring Security devolve 403 (não 401) pra QUALQUER
    // requisição sem autenticação, mesmo em rotas que exigem login — é o
    // comportamento padrão dele quando não existe formLogin()/httpBasic()
    // configurado. Esse bean corrige isso: agora "sem credencial nenhuma"
    // sempre devolve 401, que é o correto pela convenção REST (401 = não
    // autenticado; 403 fica reservado pra quando a pessoa ESTÁ autenticada
    // mas não tem permissão pra aquela ação específica — como já acontece
    // no seu AccessDeniedException de Story, por exemplo).
    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) ->
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, SecurityFilter securityFilter)
            throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception.authenticationEntryPoint(authenticationEntryPoint()))
                .authorizeHttpRequests(authorize -> authorize
                                .requestMatchers(HttpMethod.POST, "/login").permitAll()
//                              .requestMatchers(HttpMethod.POST, "/logout").permitAll()
                                .requestMatchers(HttpMethod.POST, "/users").permitAll()
                                .requestMatchers(HttpMethod.POST, "/users/forgot-password").permitAll()
                                .requestMatchers(HttpMethod.POST, "/users/reset-password").permitAll()
                                .requestMatchers(HttpMethod.POST, "/users/resend-verification").permitAll()
                                .requestMatchers(HttpMethod.GET, "/users/verify").permitAll()
                                .requestMatchers(HttpMethod.GET, "/stories/**").permitAll()
                                .requestMatchers(
                                        "/v3/api-docs/**",
                                        "/swagger-ui/**",
                                        "/swagger-ui.html",
                                        "/swagger-resources/**",
                                        "/webjars/**"
                                ).permitAll()
                                .anyRequest().authenticated()
                )
                .logout(logout -> logout.disable())
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();

        // Aceita o React local (5173/3000) e qualquer outra origem durante o desenvolvimento
        configuration.setAllowedOrigins(List.of(
                "https://historiasanonimas.vercel.app",
                "http://localhost:5173",
                "http://localhost:3000"));

        // Libera todos os cabeçalhos para o Swagger e ferramentas REST não serem bloqueados
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Permite o envio de Cookies (jwtToken) entre origens
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    @Bean
    public  AuthenticationManager authenticationManager(AuthenticationConfiguration config){

        return config.getAuthenticationManager();
    }
}