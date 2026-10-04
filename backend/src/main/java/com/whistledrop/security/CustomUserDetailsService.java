package com.whistledrop.security;

import com.whistledrop.entity.ModeratorUser;
import com.whistledrop.repository.ModeratorUserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final ModeratorUserRepository moderatorUserRepository;

    public CustomUserDetailsService(ModeratorUserRepository moderatorUserRepository) {
        this.moderatorUserRepository = moderatorUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        ModeratorUser user = moderatorUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Moderator not found with username: " + username));

        return new User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}
