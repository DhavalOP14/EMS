package com.ems.backend.service.impl;

import com.ems.backend.constant.RoleConstants;
import com.ems.backend.dto.employee.EmployeeRequest;
import com.ems.backend.dto.employee.EmployeeResponse;
import com.ems.backend.entity.Department;
import com.ems.backend.entity.Role;
import com.ems.backend.entity.User;
import com.ems.backend.exception.DuplicateResourceException;
import com.ems.backend.exception.ResourceNotFoundException;
import com.ems.backend.repository.DepartmentRepository;
import com.ems.backend.repository.RoleRepository;
import com.ems.backend.repository.UserRepository;
import com.ems.backend.service.EmployeeService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

public class EmployeeServiceImp implements EmployeeService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeServiceImp(UserRepository userRepository, RoleRepository roleRepository, DepartmentRepository departmentRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public EmployeeResponse createEmployee(EmployeeRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email already exists."
            );
        }

        Role role = getRole(request.getRoleId());

        Department department = getDepartment(
                request.getDepartmentId()
        );

        User manager = getManager(
                request.getManagerId()
        );

        User user = buildEmployee(
                request,
                role,
                department,
                manager
        );

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }


    @Override
    public List<EmployeeResponse> getAllEmployees() {

        List<String> employeeRoles = List.of(
                RoleConstants.MANAGER,
                RoleConstants.EMPLOYEE
        );

        return userRepository
                .findByActiveTrueAndRole_NameIn(employeeRoles)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public EmployeeResponse getEmployeeById(Long id) {
        return null;
    }

    @Override
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        return null;
    }

    @Override
    public void deleteEmployee(Long id) {

    }

    private EmployeeResponse mapToResponse(User user) {

        EmployeeResponse response = new EmployeeResponse();

        response.setId(user.getId());
        response.setEmployeeCode(user.getEmployeeCode());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());

        response.setRole(user.getRole().getName());

        response.setDepartment(
                user.getDepartment() != null
                        ? user.getDepartment().getName()
                        : null
        );

        response.setManager(
                user.getManager() != null
                        ? user.getManager().getFirstName() + " "
                        + user.getManager().getLastName()
                        : null
        );

        response.setDesignation(user.getDesignation());
        response.setSalary(user.getSalary());
        response.setJoiningDate(user.getJoiningDate());
        response.setActive(user.getActive());

        return response;
    }


    private Role getRole(Integer roleId) {

        return roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found with id: " + roleId
                        )
                );
    }

    private Department getDepartment(Long departmentId) {

        return departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id: "
                                        + departmentId
                        )
                );
    }

    private User getManager(Long managerId) {

        if (managerId == null) {
            return null;
        }

        return userRepository.findById(managerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Manager not found with id: "
                                        + managerId
                        )
                );
    }
    private String generateEmployeeCode() {
        return "EMP" + System.currentTimeMillis();
    }

    private User buildEmployee(
            EmployeeRequest request,
            Role role,
            Department department,
            User manager
    ) {

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setPhone(request.getPhone());
        user.setDesignation(request.getDesignation());
        user.setSalary(request.getSalary());
        user.setJoiningDate(request.getJoiningDate());

        user.setRole(role);
        user.setDepartment(department);
        user.setManager(manager);

        user.setEmployeeCode(generateEmployeeCode());

        return user;
    }
}
