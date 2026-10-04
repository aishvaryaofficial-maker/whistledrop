package com.whistledrop.dto.response;

public class ModeratorStatsResponse {

    private long totalReports;
    private long submittedCount;
    private long underReviewCount;
    private long resolvedCount;
    private long dismissedCount;

    public ModeratorStatsResponse() {
    }

    public ModeratorStatsResponse(long totalReports, long submittedCount, long underReviewCount, long resolvedCount, long dismissedCount) {
        this.totalReports = totalReports;
        this.submittedCount = submittedCount;
        this.underReviewCount = underReviewCount;
        this.resolvedCount = resolvedCount;
        this.dismissedCount = dismissedCount;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(long totalReports) {
        this.totalReports = totalReports;
    }

    public long getSubmittedCount() {
        return submittedCount;
    }

    public void setSubmittedCount(long submittedCount) {
        this.submittedCount = submittedCount;
    }

    public long getUnderReviewCount() {
        return underReviewCount;
    }

    public void setUnderReviewCount(long underReviewCount) {
        this.underReviewCount = underReviewCount;
    }

    public long getResolvedCount() {
        return resolvedCount;
    }

    public void setResolvedCount(long resolvedCount) {
        this.resolvedCount = resolvedCount;
    }

    public long getDismissedCount() {
        return dismissedCount;
    }

    public void setDismissedCount(long dismissedCount) {
        this.dismissedCount = dismissedCount;
    }
}
