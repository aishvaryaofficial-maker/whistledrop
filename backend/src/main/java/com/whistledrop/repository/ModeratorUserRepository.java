package com.whistledrop.repository;

import com.whistledrop.entity.ModeratorUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModeratorUserRepository extends JpaRepository<ModeratorUser, Long> {
    Optional<ModeratorUser> findByUsername(String username);
    boolean existsByUsername(String username);
}
