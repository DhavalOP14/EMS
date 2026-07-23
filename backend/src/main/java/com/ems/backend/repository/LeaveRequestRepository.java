package com.ems.backend.repository;

import com.ems.backend.entity.LeaveRequest;
import com.ems.backend.entity.User;
import com.ems.backend.enums.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LeaveRequestRepository
        extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByActiveTrue();

    Optional<LeaveRequest> findByIdAndActiveTrue(Long id);

    List<LeaveRequest> findByEmployeeAndActiveTrue(User employee);

    List<LeaveRequest> findByStatusAndActiveTrue(LeaveStatus status);

    List<LeaveRequest> findByEmployeeAndStatusAndActiveTrue(
            User employee,
            LeaveStatus status
    );

    List<LeaveRequest> findByStartDateBetweenAndActiveTrue(
            LocalDate startDate,
            LocalDate endDate
    );
}