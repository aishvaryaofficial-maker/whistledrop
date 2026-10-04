package com.whistledrop.dto.response;

import com.whistledrop.entity.Report;
import com.whistledrop.entity.ReportCategory;
import com.whistledrop.entity.ReportStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class ReportDetailResponse {

    private String caseCode;
    private ReportCategory category;
    private String categoryDisplayName;
    private String description;
    private String evidenceUrl;
    private ReportStatus status;
    private String statusDisplayName;
    private String statusDescription;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<StatusUpdateResponse> statusUpdates = new ArrayList<>();
    private Set<ReportStatus> allowedTransitions;

    public ReportDetailResponse() {
    }

    public static ReportDetailResponse fromEntity(Report report) {
        ReportDetailResponse res = new ReportDetailResponse();
        res.setCaseCode(report.getCaseCode());
        res.setCategory(report.getCategory());
        res.setCategoryDisplayName(report.getCategory().displayName());
        res.setDescription(report.getDescription());
        res.setEvidenceUrl(report.getEvidenceUrl());
        res.setStatus(report.getStatus());
        res.setStatusDisplayName(report.getStatus().displayName());
        res.setStatusDescription(report.getStatus().description());
        res.setCreatedAt(report.getCreatedAt());
        res.setUpdatedAt(report.getUpdatedAt());
        res.setAllowedTransitions(report.getStatus().allowedTransitions());

        if (report.getStatusUpdates() != null) {
            res.setStatusUpdates(
                report.getStatusUpdates().stream()
                    .map(StatusUpdateResponse::fromEntity)
                    .collect(Collectors.toList())
            );
        }
        return res;
    }

    public String getCaseCode() {
        return caseCode;
    }

    public void setCaseCode(String caseCode) {
        this.caseCode = caseCode;
    }

    public ReportCategory getCategory() {
        return category;
    }

    public void setCategory(ReportCategory category) {
        this.category = category;
    }

    public String getCategoryDisplayName() {
        return categoryDisplayName;
    }

    public void setCategoryDisplayName(String categoryDisplayName) {
        this.categoryDisplayName = categoryDisplayName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEvidenceUrl() {
        return evidenceUrl;
    }

    public void setEvidenceUrl(String evidenceUrl) {
        this.evidenceUrl = evidenceUrl;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public String getStatusDisplayName() {
        return statusDisplayName;
    }

    public void setStatusDisplayName(String statusDisplayName) {
        this.statusDisplayName = statusDisplayName;
    }

    public String getStatusDescription() {
        return statusDescription;
    }

    public void setStatusDescription(String statusDescription) {
        this.statusDescription = statusDescription;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<StatusUpdateResponse> getStatusUpdates() {
        return statusUpdates;
    }

    public void setStatusUpdates(List<StatusUpdateResponse> statusUpdates) {
        this.statusUpdates = statusUpdates;
    }

    public Set<ReportStatus> getAllowedTransitions() {
        return allowedTransitions;
    }

    public void setAllowedTransitions(Set<ReportStatus> allowedTransitions) {
        this.allowedTransitions = allowedTransitions;
    }
}
