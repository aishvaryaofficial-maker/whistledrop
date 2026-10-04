package com.whistledrop.dto.response;

import com.whistledrop.entity.Report;
import com.whistledrop.entity.ReportCategory;
import com.whistledrop.entity.ReportStatus;
import java.time.LocalDateTime;

public class ReportSummaryResponse {

    private String caseCode;
    private ReportCategory category;
    private String categoryDisplayName;
    private ReportStatus status;
    private String statusDisplayName;
    private String previewDescription;
    private boolean hasEvidence;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReportSummaryResponse() {
    }

    public static ReportSummaryResponse fromEntity(Report report) {
        ReportSummaryResponse res = new ReportSummaryResponse();
        res.setCaseCode(report.getCaseCode());
        res.setCategory(report.getCategory());
        res.setCategoryDisplayName(report.getCategory().displayName());
        res.setStatus(report.getStatus());
        res.setStatusDisplayName(report.getStatus().displayName());
        
        String desc = report.getDescription();
        if (desc != null && desc.length() > 120) {
            res.setPreviewDescription(desc.substring(0, 117) + "...");
        } else {
            res.setPreviewDescription(desc);
        }

        res.setHasEvidence(report.getEvidenceUrl() != null && !report.getEvidenceUrl().trim().isEmpty());
        res.setCreatedAt(report.getCreatedAt());
        res.setUpdatedAt(report.getUpdatedAt());
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

    public String getPreviewDescription() {
        return previewDescription;
    }

    public void setPreviewDescription(String previewDescription) {
        this.previewDescription = previewDescription;
    }

    public boolean isHasEvidence() {
        return hasEvidence;
    }

    public void setHasEvidence(boolean hasEvidence) {
        this.hasEvidence = hasEvidence;
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
}
