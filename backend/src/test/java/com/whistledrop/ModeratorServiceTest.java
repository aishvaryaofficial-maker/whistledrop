package com.whistledrop;

import com.whistledrop.dto.request.UpdateStatusRequest;
import com.whistledrop.dto.response.ModeratorStatsResponse;
import com.whistledrop.dto.response.ReportDetailResponse;
import com.whistledrop.entity.Report;
import com.whistledrop.entity.ReportCategory;
import com.whistledrop.entity.ReportStatus;
import com.whistledrop.exception.InvalidStatusTransitionException;
import com.whistledrop.repository.ReportRepository;
import com.whistledrop.repository.StatusUpdateRepository;
import com.whistledrop.service.ModeratorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ModeratorServiceTest {

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private StatusUpdateRepository statusUpdateRepository;

    private ModeratorService moderatorService;

    @BeforeEach
    void setUp() {
        moderatorService = new ModeratorService(reportRepository, statusUpdateRepository);
    }

    @Test
    @DisplayName("Should successfully transition status from SUBMITTED to UNDER_REVIEW with an update note")
    void shouldTransitionFromSubmittedToUnderReview() {
        String caseCode = "WD-TEST1234";
        Report report = new Report(caseCode, ReportCategory.CORRUPTION, "Corruption details with substantive notes.", null);
        report.setStatus(ReportStatus.SUBMITTED);

        when(reportRepository.findByCaseCodeWithUpdates(caseCode)).thenReturn(Optional.of(report));
        when(reportRepository.save(any(Report.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateStatusRequest request = new UpdateStatusRequest(
                ReportStatus.UNDER_REVIEW,
                "Case assigned to senior investigator."
        );

        ReportDetailResponse response = moderatorService.updateStatus(caseCode, request);

        assertEquals(ReportStatus.UNDER_REVIEW, response.getStatus());
        verify(statusUpdateRepository, times(1)).save(any());
        verify(reportRepository, times(1)).save(report);
    }

    @Test
    @DisplayName("Should reject invalid status transition from RESOLVED back to SUBMITTED")
    void shouldRejectInvalidStatusTransition() {
        String caseCode = "WD-TEST1234";
        Report report = new Report(caseCode, ReportCategory.TECHNICAL, "Bug details in submission portal.", null);
        report.setStatus(ReportStatus.RESOLVED);

        when(reportRepository.findByCaseCodeWithUpdates(caseCode)).thenReturn(Optional.of(report));

        UpdateStatusRequest request = new UpdateStatusRequest(
                ReportStatus.SUBMITTED,
                "Attempting to set back to submitted"
        );

        assertThrows(InvalidStatusTransitionException.class, () ->
                moderatorService.updateStatus(caseCode, request)
        );

        verify(reportRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should correctly compute dashboard statistics")
    void shouldComputeDashboardStats() {
        when(reportRepository.count()).thenReturn(10L);
        when(reportRepository.countByStatus(ReportStatus.SUBMITTED)).thenReturn(4L);
        when(reportRepository.countByStatus(ReportStatus.UNDER_REVIEW)).thenReturn(3L);
        when(reportRepository.countByStatus(ReportStatus.RESOLVED)).thenReturn(2L);
        when(reportRepository.countByStatus(ReportStatus.DISMISSED)).thenReturn(1L);

        ModeratorStatsResponse stats = moderatorService.getDashboardStats();

        assertEquals(10L, stats.getTotalReports());
        assertEquals(4L, stats.getSubmittedCount());
        assertEquals(3L, stats.getUnderReviewCount());
        assertEquals(2L, stats.getResolvedCount());
        assertEquals(1L, stats.getDismissedCount());
    }
}
