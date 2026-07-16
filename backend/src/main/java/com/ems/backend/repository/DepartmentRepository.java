package com.ems.backend.repository;

import com.ems.backend.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department,Long> {

    Optional<Department> findByName(String name);

    boolean existsByName(String name);

    List<Department> findByActiveTrue();
}
