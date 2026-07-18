package com.ems.backend.service.impl;

import com.ems.backend.dto.department.DepartmentRequest;
import com.ems.backend.dto.department.DepartmentResponse;
import com.ems.backend.entity.Department;
import com.ems.backend.exception.DuplicateResourceException;
import com.ems.backend.exception.ResourceNotFoundException;
import com.ems.backend.repository.DepartmentRepository;
import com.ems.backend.service.DepartmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

     private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }


    @Override
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new RuntimeException(
                    "Department already exists.");
        }

        Department department = new Department();

        department.setName(request.getName());
        department.setDescription(request.getDescription());

        Department savedDepartment =
                departmentRepository.save(department);

        return mapToResponse(savedDepartment);

    }



    @Override
    public List<DepartmentResponse> getAllDepartments() {

        return departmentRepository.findByActiveTrue()
                .stream()
                .map(department -> mapToResponse(department))
                .toList();
    }

    @Override
    public DepartmentResponse getDepartmentById(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id: " + id
                        )
                );

        return mapToResponse(department);
    }

    @Override
    public DepartmentResponse updateDepartment(
            Long id,
            DepartmentRequest request) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id: " + id
                        )
                );

        if (!department.getName().equals(request.getName())
                && departmentRepository.existsByName(request.getName())) {

            throw new DuplicateResourceException(
                    "Department already exists."
            );
        }

        department.setName(request.getName());
        department.setDescription(request.getDescription());

        Department updatedDepartment =
                departmentRepository.save(department);

        return mapToResponse(updatedDepartment);
    }


    @Override
    public void deleteDepartment(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id: " + id
                        )
                );

        department.setActive(false);

        departmentRepository.save(department);
    }


    private DepartmentResponse mapToResponse(
            Department department) {

        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription(),
                department.getActive()
        );
    }
}
