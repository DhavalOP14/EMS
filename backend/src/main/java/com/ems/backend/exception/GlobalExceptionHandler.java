package com.ems.backend.exception;

import com.ems.backend.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResource(

            DuplicateResourceException ex,

            HttpServletRequest request) {

        ErrorResponse response = new ErrorResponse(

                LocalDateTime.now(),

                HttpStatus.CONFLICT.value(),

                HttpStatus.CONFLICT.getReasonPhrase(),

                ex.getMessage(),

                request.getRequestURI()

        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(

            ResourceNotFoundException ex,

            HttpServletRequest request) {

        ErrorResponse response = new ErrorResponse(

                LocalDateTime.now(),

                HttpStatus.NOT_FOUND.value(),

                HttpStatus.NOT_FOUND.getReasonPhrase(),

                ex.getMessage(),

                request.getRequestURI()

        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(

            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->

                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )

                );

        return ResponseEntity
                .badRequest()
                .body(errors);
    }

}