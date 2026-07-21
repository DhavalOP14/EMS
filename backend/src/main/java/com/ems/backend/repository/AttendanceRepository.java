package com.ems.backend.repository;

import com.ems.backend.entity.Attendance;
import com.ems.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByActiveTrue();

    Optional<Attendance> findByIdAndActiveTrue(Long id);

    List<Attendance> findByEmployeeAndActiveTrue(User employee);

    List<Attendance> findByAttendanceDateAndActiveTrue(LocalDate attendanceDate);

    Optional<Attendance> findByEmployeeAndAttendanceDateAndActiveTrue(
            User employee,
            LocalDate attendanceDate
    );

}