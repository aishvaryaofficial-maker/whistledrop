package com.whistledrop.entity;

import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

public enum ReportStatus {
    SUBMITTED("Submitted", "Report received and queued for triage"),
    UNDER_REVIEW("Under Review", "An assigned moderator is reviewing the report details"),
    RESOLVED("Resolved", "Investigation concluded and necessary actions completed"),
    DISMISSED("Dismissed", "Report closed due to insufficient detail, duplication, or invalidity");

    private final String displayName;
    private final String description;

    ReportStatus(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String displayName() {
        return displayName;
    }

    public String description() {
        return description;
    }

    /**
     * Determines if a status transition from this status to target status is valid.
     */
    public boolean canTransitionTo(ReportStatus target) {
        if (target == null) {
            return false;
        }
        if (this == target) {
            // Re-affirming the same status with a new update note is allowed
            return true;
        }

        switch (this) {
            case SUBMITTED:
                return target == UNDER_REVIEW || target == RESOLVED || target == DISMISSED;
            case UNDER_REVIEW:
                return target == RESOLVED || target == DISMISSED;
            case RESOLVED:
            case DISMISSED:
                // Terminal statuses can only be reopened back to UNDER_REVIEW with justification
                return target == UNDER_REVIEW;
            default:
                return false;
        }
    }

    public Set<ReportStatus> allowedTransitions() {
        switch (this) {
            case SUBMITTED:
                return EnumSet.of(UNDER_REVIEW, RESOLVED, DISMISSED);
            case UNDER_REVIEW:
                return EnumSet.of(RESOLVED, DISMISSED);
            case RESOLVED:
            case DISMISSED:
                return EnumSet.of(UNDER_REVIEW);
            default:
                return Collections.emptySet();
        }
    }
}
