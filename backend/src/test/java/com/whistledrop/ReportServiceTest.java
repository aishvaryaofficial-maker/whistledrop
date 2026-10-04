package com.whistledrop;

import com.whistledrop.dto.request.CreateReportRequest;
import com.whistledrop.dto.response.ReportDetailResponse;
import com.whistledrop.entity.Report;
import com.whistledrop.entity.ReportCategory;
import com.whistledrop.entity.ReportStatus;
import com.whistledrop.exception.ResourceNotFoundException;
import com.whistledrop.repository.ReportRepository;
import com.whistledrop.service.CaseCodeGenerator;
import com.whistledrop.service.ReportService;
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
class ReportServiceTest {

    @Mock
    private ReportRepository reportRepository;

    private CaseCodeGenerator caseCodeGenerator;
    private ReportService reportService;

    @BeforeEach
    void setUp() {
        caseCodeGenerator = new CaseCodeGenerator(reportRepository);
        reportService = new ReportService(reportRepository, caseCodeGenerator);
    }

    @Test
    @DisplayName("Should submit report anonymously, allocate case code, and record initial SUBMITTED status")
    void shouldSubmitReportSuccessfully() {
        when(reportRepository.existsByCaseCode(anyString())).thenReturn(false);
        when(reportRepository.save(any(Report.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CreateReportRequest request = new CreateReportRequest(
                ReportCategory.SECURITY,
                "Detailed description of potential vulnerability found in user authorization endpoint.",
                "https://example.com/evidence"
        );

        ReportDetailResponse response = reportService.submitReport(request);

        assertNotNull(response);
        assertNotNull(response.getCaseCode());
        assertTrue(response.getCaseCode().startsWith("WD-"));
        assertEquals(ReportCategory.SECURITY, response.getCategory());
        assertEquals(ReportStatus.SUBMITTED, response.getStatus());
        assertEquals(1, response.getStatusUpdates().size());
        assertEquals(ReportStatus.SUBMITTED, response.getStatusUpdates().get(0).getStatus());

        verify(reportRepository, times(1)).save(any(Report.class));
    }

    @Test
    @DisplayName("Should successfully track an existing report by case code")
    void shouldTrackExistingReport() {
        String caseCode = "WD-9K4M8X2P";
        Report report = new Report(
                caseCode,
                ReportCategory.HARASSMENT,
                "Detailed incident description that has been logged previously.",
                null
        );
        when(reportRepository.findByCaseCodeWithUpdates(caseCode)).thenReturn(Optional.of(report));

        ReportDetailResponse response = reportService.getReportByCaseCode(caseCode);

        assertNotNull(response);
        assertEquals(caseCode, response.getCaseCode());
        assertEquals(ReportCategory.HARASSMENT, response.getCategory());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when tracking unknown case code")
    void shouldThrowWhenTrackingNonExistentReport() {
        String unknownCode = "WD-UNKNOWN99";
        when(reportRepository.findByCaseCodeWithUpdates(unknownCode)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> reportService.getReportByCaseCode(unknownCode));
    }
}
