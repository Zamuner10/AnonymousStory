package com.viniciuskz.anonymousstories.config;

import com.viniciuskz.anonymousstories.repository.UserRepository;
import com.viniciuskz.anonymousstories.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
    public class SecurityFilter extends OncePerRequestFilter {

        private final TokenService tokenService;
        private final UserRepository userRepository;

        public SecurityFilter (TokenService tokenService, UserRepository userRepository) {
            this.tokenService = tokenService;
            this.userRepository = userRepository;
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {

            var token = recoverToken(request);

            if(token !=null){
                var email = tokenService.validateToken(token);

                if(!email.isEmpty()){
                    var user = userRepository.findByEmail(email).orElse(null);

                    if(user != null){
                        var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            }

            filterChain.doFilter(request, response);
        }

        private String recoverToken(HttpServletRequest request){
            var authHeader = request.getHeader("Authorization");
            if(authHeader != null && authHeader.startsWith("Bearer")){
                return authHeader.replace("Bearer", "").trim();
            }

            if (request.getCookies() != null){
                for (Cookie cookie: request.getCookies()){
                    if("acessToken".equals(cookie.getName())){
                    return cookie.getValue();
                        }
                    }
                }

            return null;
            }
    }


