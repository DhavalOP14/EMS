package com.ems.backend.repository;

import com.ems.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User ,Long>
{
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByActiveTrue();

    List<User> findByActiveTrueAndRole_NameIn(List<String> roles);

    Optional<User> findByIdAndActiveTrueAndRole_NameIn(
            Long id,
            List<String> roles
    );
}
