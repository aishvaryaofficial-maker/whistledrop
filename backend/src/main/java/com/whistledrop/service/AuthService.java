package com.whistledrop.service;

import com.whistledrop.dto.request.LoginRequest;
import com.whistledrop.dto.response.LoginResponse;
import com.whistledrop.entity.ModeratorUser;
import com.whistledrop.repository.ModeratorUserRepository;
import com.whistledrop.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final ModeratorUserRepository moderatorUserRepository;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            ModeratorUserRepository moderatorUserRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.moderatorUserRepository = moderatorUserRepository;
    }

    public LoginResponse authenticate(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername().trim(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        ModeratorUser user = moderatorUserRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtService.generateToken(userDetails, user.getRole());

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getRole(),
                jwtService.getJwtExpirationMs()
        );
    }
}
