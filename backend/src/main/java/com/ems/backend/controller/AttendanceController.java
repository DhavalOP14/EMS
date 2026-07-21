package com.ems.backend.controller;

import com.ems.backend.dto.attendance.AttendanceRequest;
import com.ems.backend.dto.attendance.AttendanceResponse;
import com.ems.backend.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<AttendanceResponse> markAttendance(
            @Valid @RequestBody AttendanceRequest request
    ) {

        AttendanceResponse response =
                attendanceService.markAttendance(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<AttendanceResponse>> getAllAttendance() {

        List<AttendanceResponse> response =
                attendanceService.getAllAttendance();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceResponse> getAttendanceById(
            @PathVariable Long id
    ) {

        AttendanceResponse response =
                attendanceService.getAttendanceById(id);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByEmployee(
            @PathVariable Long employeeId
    ) {

        List<AttendanceResponse> response =
                attendanceService.getAttendanceByEmployee(employeeId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/date/{attendanceDate}")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByDate(
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate attendanceDate
    ) {

        List<AttendanceResponse> response =
                attendanceService.getAttendanceByDate(attendanceDate);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceResponse> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRequest request
    ) {

        AttendanceResponse response =
                attendanceService.updateAttendance(id, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(
            @PathVariable Long id
    ) {

        attendanceService.deleteAttendance(id);

        return ResponseEntity.noContent().build();
    }
}