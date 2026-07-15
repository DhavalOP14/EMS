package com.ems.backend.repository;

import com.ems.backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role , Integer> {

    Optional<Role> findByName(String name);
}
