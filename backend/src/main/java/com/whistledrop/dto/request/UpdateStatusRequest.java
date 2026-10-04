package com.whistledrop.dto.request;

import com.whistledrop.entity.ReportStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "Payload for updating a report status with an audit note")
public class UpdateStatusRequest {

    @Schema(description = "New status to apply", example = "UNDER_REVIEW", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Target status is required (SUBMITTED, UNDER_REVIEW, RESOLVED, DISMISSED)")
    private ReportStatus status;

    @Schema(description = "Explanation or audit message for this status update", example = "The report is currently being investigated by the internal audit team.", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Status update message is required")
    @Size(min = 5, max = 1000, message = "Status message must be between 5 and 1000 characters")
    private String message;

    public UpdateStatusRequest() {
    }

    public UpdateStatusRequest(ReportStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
