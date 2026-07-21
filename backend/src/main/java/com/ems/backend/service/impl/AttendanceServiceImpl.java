package com.ems.backend.service.impl;

import com.ems.backend.constant.RoleConstants;
import com.ems.backend.dto.attendance.AttendanceRequest;
import com.ems.backend.dto.attendance.AttendanceResponse;
import com.ems.backend.entity.Attendance;
import com.ems.backend.entity.User;
import com.ems.backend.exception.BadRequestException;
import com.ems.backend.exception.DuplicateResourceException;
import com.ems.backend.exception.ResourceNotFoundException;
import com.ems.backend.repository.AttendanceRepository;
import com.ems.backend.repository.UserRepository;
import com.ems.backend.service.AttendanceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    public AttendanceServiceImpl(AttendanceRepository attendanceRepository, UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AttendanceResponse markAttendance(AttendanceRequest request) {

        // Check whether employee exists and is active
        User employee = getEmployee(request.getEmployeeId());

        // Check duplicate attendance
        attendanceRepository
                .findByEmployeeAndAttendanceDateAndActiveTrue(
                        employee,
                        request.getAttendanceDate()
                )
                .ifPresent(attendance -> {
                    throw new DuplicateResourceException(
                            "Attendance already marked for this employee on "
                                    + request.getAttendanceDate()
                    );
                });

        // Validate attendance details
        validateAttendance(request);

        Attendance attendance = new Attendance();

        attendance.setEmployee(employee);
        attendance.setAttendanceDate(request.getAttendanceDate());
        attendance.setCheckIn(request.getCheckIn());
        attendance.setCheckOut(request.getCheckOut());
        attendance.setStatus(request.getStatus());
        attendance.setRemarks(request.getRemarks());

        attendance.setWorkingHours(
                calculateWorkingHours(
                        request.getCheckIn(),
                        request.getCheckOut()
                )
        );

        Attendance savedAttendance =
                attendanceRepository.save(attendance);

        return mapToResponse(savedAttendance);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAllAttendance() {

        return attendanceRepository
                .findByActiveTrue()
                .stream()
                .map(attendance -> mapToResponse(attendance))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceResponse getAttendanceById(Long id) {

        Attendance attendance = getAttendance(id);

        return mapToResponse(attendance);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceByEmployee(Long employeeId) {

        User employee = getEmployee(employeeId);

        return attendanceRepository
                .findByEmployeeAndActiveTrue(employee)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceByDate(
            LocalDate attendanceDate
    ) {

        return attendanceRepository
                .findByAttendanceDateAndActiveTrue(attendanceDate)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AttendanceResponse updateAttendance(
            Long id,
            AttendanceRequest request
    ) {

        // Get existing attendance
        Attendance attendance = getAttendance(id);

        // Get employee
        User employee = getEmployee(request.getEmployeeId());

        // Check duplicate attendance only if employee or date changes
        attendanceRepository
                .findByEmployeeAndAttendanceDateAndActiveTrue(
                        employee,
                        request.getAttendanceDate()
                )
                .ifPresent(existingAttendance -> {

                    if (!existingAttendance.getId().equals(attendance.getId())) {

                        throw new DuplicateResourceException(
                                "Attendance already exists for this employee on "
                                        + request.getAttendanceDate()
                        );
                    }
                });

        // Validate request
        validateAttendance(request);

        // Update fields
        attendance.setEmployee(employee);
        attendance.setAttendanceDate(request.getAttendanceDate());
        attendance.setCheckIn(request.getCheckIn());
        attendance.setCheckOut(request.getCheckOut());
        attendance.setStatus(request.getStatus());
        attendance.setRemarks(request.getRemarks());

        attendance.setWorkingHours(
                calculateWorkingHours(
                        request.getCheckIn(),
                        request.getCheckOut()
                )
        );

        Attendance updatedAttendance =
                attendanceRepository.save(attendance);

        return mapToResponse(updatedAttendance);
    }

    @Override
    public void deleteAttendance(Long id) {

        Attendance attendance = getAttendance(id);

        attendance.setActive(false);

        attendanceRepository.save(attendance);
    }

    private User getEmployee(Long employeeId) {

        return userRepository
                .findByIdAndActiveTrueAndRole_NameIn(
                        employeeId,
                        List.of(
                                RoleConstants.EMPLOYEE,
                                RoleConstants.MANAGER
                        )
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: " + employeeId
                        )
                );
    }
    private Attendance getAttendance(Long attendanceId) {

        return attendanceRepository
                .findByIdAndActiveTrue(attendanceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Attendance not found with id: " + attendanceId
                        )
                );
    }
    private Double calculateWorkingHours(
            LocalTime checkIn,
            LocalTime checkOut
    ) {

        if (checkIn == null || checkOut == null) {
            return null;
        }

        if (checkOut.isBefore(checkIn)) {
            throw new BadRequestException(
                    "Check-out cannot be before Check-in."
            );
        }

        Duration duration = Duration.between(checkIn, checkOut);

        return duration.toMinutes() / 60.0;
    }

    private void validateAttendance(AttendanceRequest request) {

        switch (request.getStatus()) {

            case PRESENT:
            case HALF_DAY:

                if (request.getCheckIn() == null
                        || request.getCheckOut() == null) {

                    throw new BadRequestException(
                            "Check-out cannot be before Check-in."
                    );
                }

                if (request.getCheckOut()
                        .isBefore(request.getCheckIn())) {

                    throw new BadRequestException(
                            "Check-out cannot be before Check-in."
                    );
                }

                break;

            case ABSENT:
            case LEAVE:
            case HOLIDAY:

                if (request.getCheckIn() != null
                        || request.getCheckOut() != null) {

                    throw new BadRequestException(
                            "Check-in and Check-out must be empty for this attendance status."
                    );
                }

                break;
        }
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {

        AttendanceResponse response = new AttendanceResponse();

        response.setId(attendance.getId());

        response.setEmployeeName(
                attendance.getEmployee().getFirstName() + " "
                        + attendance.getEmployee().getLastName()
        );

        response.setEmployeeCode(
                attendance.getEmployee().getEmployeeCode()
        );

        response.setAttendanceDate(
                attendance.getAttendanceDate()
        );

        response.setCheckIn(
                attendance.getCheckIn()
        );

        response.setCheckOut(
                attendance.getCheckOut()
        );

        response.setStatus(
                attendance.getStatus()
        );

        response.setWorkingHours(
                attendance.getWorkingHours()
        );

        response.setRemarks(
                attendance.getRemarks()
        );

        return response;
    }

}
