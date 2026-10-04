package com.whistledrop.service;

import com.whistledrop.dto.request.CreateReportRequest;
import com.whistledrop.dto.response.ReportDetailResponse;
import com.whistledrop.entity.Report;
import com.whistledrop.entity.ReportStatus;
import com.whistledrop.entity.StatusUpdate;
import com.whistledrop.exception.ResourceNotFoundException;
import com.whistledrop.repository.ReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportService.class);

    private final ReportRepository reportRepository;
    private final CaseCodeGenerator caseCodeGenerator;

    public ReportService(ReportRepository reportRepository, CaseCodeGenerator caseCodeGenerator) {
        this.reportRepository = reportRepository;
        this.caseCodeGenerator = caseCodeGenerator;
    }

    /**
     * Submits an anonymous report, allocates a cryptographically secure case code,
     * logs an initial status update, and persists the report.
     */
    @Transactional
    public ReportDetailResponse submitReport(CreateReportRequest request) {
        String caseCode = caseCodeGenerator.generateUniqueCaseCode();

        String evidenceUrl = null;
        if (request.getEvidenceUrl() != null && !request.getEvidenceUrl().trim().isEmpty()) {
            evidenceUrl = request.getEvidenceUrl().trim();
        }

        Report report = new Report(
                caseCode,
                request.getCategory(),
                request.getDescription().trim(),
                evidenceUrl
        );

        // Record initial status update in timeline
        StatusUpdate initialUpdate = new StatusUpdate(
                report,
                ReportStatus.SUBMITTED,
                "Report securely received by WhistleDrop. Awaiting initial triage by moderator team."
        );
        report.addStatusUpdate(initialUpdate);

        Report savedReport = reportRepository.save(report);
        log.info("Confidential report submitted successfully with case code: {} [category: {}]", caseCode, request.getCategory());

        return ReportDetailResponse.fromEntity(savedReport);
    }

    /**
     * Public tracking endpoint: finds a report solely by its case code.
     * Never exposes reporter identity or internal database IDs.
     */
    @Transactional(readOnly = true)
    public ReportDetailResponse getReportByCaseCode(String rawCaseCode) {
        if (rawCaseCode == null || rawCaseCode.trim().isEmpty()) {
            throw new ResourceNotFoundException("A valid case code is required for tracking.");
        }

        String normalizedCode = rawCaseCode.trim().toUpperCase();

        Report report = reportRepository.findByCaseCodeWithUpdates(normalizedCode)
                .orElseThrow(() -> new ResourceNotFoundException("No confidential report found for case code: " + normalizedCode));

        return ReportDetailResponse.fromEntity(report);
    }
}
