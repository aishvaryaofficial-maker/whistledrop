package com.whistledrop.dto.response;

import com.whistledrop.entity.ReportStatus;
import com.whistledrop.entity.StatusUpdate;
import java.time.LocalDateTime;

public class StatusUpdateResponse {

    private Long id;
    private ReportStatus status;
    private String statusDisplayName;
    private String message;
    private LocalDateTime createdAt;

    public StatusUpdateResponse() {
    }

    public static StatusUpdateResponse fromEntity(StatusUpdate update) {
        StatusUpdateResponse res = new StatusUpdateResponse();
        res.setId(update.getId());
        res.setStatus(update.getStatus());
        res.setStatusDisplayName(update.getStatus().displayName());
        res.setMessage(update.getMessage());
        res.setCreatedAt(update.getCreatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
