package com.ems.backend.service;

import com.ems.backend.dto.attendance.AttendanceRequest;
import com.ems.backend.dto.attendance.AttendanceResponse;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {

    AttendanceResponse markAttendance(
            AttendanceRequest request
    );

    List<AttendanceResponse> getAllAttendance();

    AttendanceResponse getAttendanceById(
            Long id
    );

    List<AttendanceResponse> getAttendanceByEmployee(
            Long employeeId
    );

    List<AttendanceResponse> getAttendanceByDate(
            LocalDate attendanceDate
    );

    AttendanceResponse updateAttendance(
            Long id,
            AttendanceRequest request
    );

    void deleteAttendance(
            Long id
    );
}