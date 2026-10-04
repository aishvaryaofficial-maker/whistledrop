package com.whistledrop.controller;

import com.whistledrop.dto.request.UpdateStatusRequest;
import com.whistledrop.dto.response.ApiResponse;
import com.whistledrop.dto.response.ModeratorStatsResponse;
import com.whistledrop.dto.response.ReportDetailResponse;
import com.whistledrop.dto.response.ReportSummaryResponse;
import com.whistledrop.entity.ReportCategory;
import com.whistledrop.entity.ReportStatus;
import com.whistledrop.service.ModeratorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/moderator/reports")
@Tag(name = "Moderator Operations", description = "Authenticated administrative review, filtering, and status management")
@SecurityRequirement(name = "BearerAuth")
public class ModeratorReportController {

    private final ModeratorService moderatorService;

    public ModeratorReportController(ModeratorService moderatorService) {
        this.moderatorService = moderatorService;
    }

    @GetMapping
    @Operation(
            summary = "List and filter reports",
            description = "Retrieve paginated list of reports with optional category, status, and case code search filters."
    )
    public ResponseEntity<ApiResponse<Page<ReportSummaryResponse>>> getReports(
            @Parameter(description = "Filter by category") @RequestParam(required = false) ReportCategory category,
            @Parameter(description = "Filter by status") @RequestParam(required = false) ReportStatus status,
            @Parameter(description = "Search term matching case code") @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ReportSummaryResponse> page = moderatorService.getReports(category, status, search, pageable);
        return ResponseEntity.ok(ApiResponse.success("Reports retrieved successfully", page));
    }

    @GetMapping("/stats")
    @Operation(
            summary = "Dashboard statistics",
            description = "Aggregate counts for Total, Submitted, Under Review, Resolved, and Dismissed reports."
    )
    public ResponseEntity<ApiResponse<ModeratorStatsResponse>> getStats() {
        ModeratorStatsResponse stats = moderatorService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard metrics retrieved successfully", stats));
    }

    @GetMapping("/{caseCode}")
    @Operation(
            summary = "Get report details for moderation",
            description = "Retrieve full report description, evidence link, complete status history, and valid transition targets."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Report detail retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Report not found")
    })
    public ResponseEntity<ApiResponse<ReportDetailResponse>> getReportDetail(
            @PathVariable String caseCode
    ) {
        ReportDetailResponse response = moderatorService.getReportDetail(caseCode);
        return ResponseEntity.ok(ApiResponse.success("Report detail retrieved successfully", response));
    }

    @PatchMapping("/{caseCode}/status")
    @Operation(
            summary = "Update report status with audit note",
            description = "Transition report to next state (e.g. SUBMITTED -> UNDER_REVIEW -> RESOLVED/DISMISSED) and record an explanation update note."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Status updated and audit note appended"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status transition or validation failure"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Report not found")
    })
    public ResponseEntity<ApiResponse<ReportDetailResponse>> updateStatus(
            @PathVariable String caseCode,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        ReportDetailResponse response = moderatorService.updateStatus(caseCode, request);
        return ResponseEntity.ok(ApiResponse.success("Report status updated successfully", response));
    }
}
