package com.whistledrop;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.whistledrop.dto.request.CreateReportRequest;
import com.whistledrop.entity.ReportCategory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PublicReportControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/reports - Should create report and return 201 Created with valid case code")
    void shouldCreateReportSuccessfully() throws Exception {
        CreateReportRequest request = new CreateReportRequest(
                ReportCategory.SECURITY,
                "Observed suspicious credential dumping attempts against the internal staging database server.",
                "https://drive.example.com/logs.zip"
        );

        mockMvc.perform(post("/api/reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.caseCode", startsWith("WD-")))
                .andExpect(jsonPath("$.data.status", is("SUBMITTED")))
                .andExpect(jsonPath("$.data.category", is("SECURITY")));
    }

    @Test
    @DisplayName("POST /api/reports - Should reject report with description shorter than 20 chars with 400 Bad Request")
    void shouldRejectInvalidReportDescription() throws Exception {
        CreateReportRequest request = new CreateReportRequest(
                ReportCategory.SECURITY,
                "Too short",
                null
        );

        mockMvc.perform(post("/api/reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.errors", not(empty())));
    }

    @Test
    @DisplayName("GET /api/reports/{caseCode} - Should return 404 for unknown case code")
    void shouldReturn404ForUnknownCaseCode() throws Exception {
        mockMvc.perform(get("/api/reports/WD-NONEXISTENT"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("No confidential report found")));
    }
}
