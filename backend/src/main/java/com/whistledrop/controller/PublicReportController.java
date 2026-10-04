package com.whistledrop.controller;

import com.whistledrop.dto.request.CreateReportRequest;
import com.whistledrop.dto.response.ApiResponse;
import com.whistledrop.dto.response.ReportDetailResponse;
import com.whistledrop.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Public Reporting", description = "Public anonymous report submission and tracking endpoints")
public class PublicReportController {

    private final ReportService reportService;

    public PublicReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    @Operation(
            summary = "Submit a confidential anonymous report",
            description = "Lodge a report without revealing identity, email, or credentials. Generates a cryptographically secure, collision-safe case code for tracking."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Report created successfully and case code allocated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request payload or failed validation")
    })
    public ResponseEntity<ApiResponse<ReportDetailResponse>> submitReport(
            @Valid @RequestBody CreateReportRequest request
    ) {
        ReportDetailResponse response = reportService.submitReport(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Report submitted successfully. Please store your case code safely.", response));
    }

    @GetMapping("/{caseCode}")
    @Operation(
            summary = "Track report by case code",
            description = "Retrieve current status, submission timeline, and moderator updates using only the case code. No credentials required."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Report status timeline successfully retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "No report found with the provided case code")
    })
    public ResponseEntity<ApiResponse<ReportDetailResponse>> trackReport(
            @Parameter(description = "Unpredictable case code (e.g., WD-7K4M9X2P)", required = true)
            @PathVariable String caseCode
    ) {
        ReportDetailResponse response = reportService.getReportByCaseCode(caseCode);
        return ResponseEntity.ok(ApiResponse.success("Report status retrieved successfully", response));
    }
}
