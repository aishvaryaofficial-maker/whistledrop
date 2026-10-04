package com.whistledrop.service;

import com.whistledrop.dto.request.UpdateStatusRequest;
import com.whistledrop.dto.response.ModeratorStatsResponse;
import com.whistledrop.dto.response.ReportDetailResponse;
import com.whistledrop.dto.response.ReportSummaryResponse;
import com.whistledrop.entity.Report;
import com.whistledrop.entity.ReportCategory;
import com.whistledrop.entity.ReportStatus;
import com.whistledrop.entity.StatusUpdate;
import com.whistledrop.exception.InvalidStatusTransitionException;
import com.whistledrop.exception.ResourceNotFoundException;
import com.whistledrop.repository.ReportRepository;
import com.whistledrop.repository.StatusUpdateRepository;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ModeratorService {

    private static final Logger log = LoggerFactory.getLogger(ModeratorService.class);

    private final ReportRepository reportRepository;
    private final StatusUpdateRepository statusUpdateRepository;

    public ModeratorService(ReportRepository reportRepository, StatusUpdateRepository statusUpdateRepository) {
        this.reportRepository = reportRepository;
        this.statusUpdateRepository = statusUpdateRepository;
    }

    /**
     * Retrieve paginated, filtered, and searched reports for the moderator dashboard.
     */
    @Transactional(readOnly = true)
    public Page<ReportSummaryResponse> getReports(
            ReportCategory category,
            ReportStatus status,
            String search,
            Pageable pageable
    ) {
        Specification<Report> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (search != null && !search.trim().isEmpty()) {
                String searchTrimmed = "%" + search.trim().toUpperCase() + "%";
                Predicate caseCodePredicate = cb.like(cb.upper(root.get("caseCode")), searchTrimmed);
                predicates.add(caseCodePredicate);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Report> page = reportRepository.findAll(spec, pageable);
        return page.map(ReportSummaryResponse::fromEntity);
    }

    /**
     * Get complete report details for moderator review.
     */
    @Transactional(readOnly = true)
    public ReportDetailResponse getReportDetail(String rawCaseCode) {
        String caseCode = rawCaseCode.trim().toUpperCase();
        Report report = reportRepository.findByCaseCodeWithUpdates(caseCode)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with case code: " + caseCode));

        return ReportDetailResponse.fromEntity(report);
    }

    /**
     * Update the report status, validating the state machine transition,
     * and recording an immutable audit status update message.
     */
    @Transactional
    public ReportDetailResponse updateStatus(String rawCaseCode, UpdateStatusRequest request) {
        String caseCode = rawCaseCode.trim().toUpperCase();
        Report report = reportRepository.findByCaseCodeWithUpdates(caseCode)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with case code: " + caseCode));

        ReportStatus currentStatus = report.getStatus();
        ReportStatus targetStatus = request.getStatus();

        // Validate allowed state transition
        if (!currentStatus.canTransitionTo(targetStatus)) {
            throw new InvalidStatusTransitionException(
                    String.format("Invalid status transition from '%s' to '%s'. Allowed next statuses: %s",
                            currentStatus.displayName(),
                            targetStatus.displayName(),
                            currentStatus.allowedTransitions())
            );
        }

        report.setStatus(targetStatus);

        // Add audit note to status history
        StatusUpdate update = new StatusUpdate(
                report,
                targetStatus,
                request.getMessage().trim()
        );
        report.addStatusUpdate(update);
        statusUpdateRepository.save(update);

        Report saved = reportRepository.save(report);
        log.info("Report {} status changed from {} to {} by moderator", caseCode, currentStatus, targetStatus);

        return ReportDetailResponse.fromEntity(saved);
    }

    /**
     * Compute statistics for moderator summary cards.
     */
    @Transactional(readOnly = true)
    public ModeratorStatsResponse getDashboardStats() {
        long total = reportRepository.count();
        long submitted = reportRepository.countByStatus(ReportStatus.SUBMITTED);
        long underReview = reportRepository.countByStatus(ReportStatus.UNDER_REVIEW);
        long resolved = reportRepository.countByStatus(ReportStatus.RESOLVED);
        long dismissed = reportRepository.countByStatus(ReportStatus.DISMISSED);

        return new ModeratorStatsResponse(total, submitted, underReview, resolved, dismissed);
    }
}
