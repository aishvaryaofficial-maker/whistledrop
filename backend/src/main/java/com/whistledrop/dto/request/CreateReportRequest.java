package com.whistledrop.dto.request;

import com.whistledrop.entity.ReportCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "Payload for submitting an anonymous confidential report")
public class CreateReportRequest {

    @Schema(description = "Category of concern", example = "SECURITY", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Category is required (SECURITY, HARASSMENT, CORRUPTION, TECHNICAL, OTHER)")
    private ReportCategory category;

    @Schema(description = "Detailed factual narrative of what occurred", example = "Observed unauthorized access attempts on database replica...", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Description cannot be empty")
    @Size(min = 20, max = 5000, message = "Description must provide sufficient detail (between 20 and 5000 characters)")
    private String description;

    @Schema(description = "Optional external evidence or reference link (e.g. encrypted drive, cloud file)", example = "https://drive.example.com/evidence-doc", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @Pattern(
        regexp = "^$|^(https?://).*",
        message = "Evidence URL must start with http:// or https://"
    )
    @Size(max = 1000, message = "Evidence URL must be at most 1000 characters")
    private String evidenceUrl;

    public CreateReportRequest() {
    }

    public CreateReportRequest(ReportCategory category, String description, String evidenceUrl) {
        this.category = category;
        this.description = description;
        this.evidenceUrl = evidenceUrl;
    }

    public ReportCategory getCategory() {
        return category;
    }

    public void setCategory(ReportCategory category) {
        this.category = category;
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
}
