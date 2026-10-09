package com.whistledrop;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.whistledrop.dto.request.CreateReportRequest;
import com.whistledrop.entity.ReportCategory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
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
    @DisplayName("POST /api/reports - Should create report anonymously without auth header and return 201 Created with valid case code")
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

    @Test
    @DisplayName("GET / - Should return 200 OK operational status without authentication")
    void shouldReturnOkFromRootStatusEndpoint() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("UP")))
                .andExpect(jsonPath("$.data.service", containsString("WhistleDrop")));
    }

    @Test
    @DisplayName("GET /api/health - Should return 200 OK health check without authentication")
    void shouldReturnOkFromHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("UP")));
    }

    @Test
    @DisplayName("OPTIONS /api/reports - Should permit CORS preflight from Vercel deployed frontend")
    void shouldAllowCorsPreflightFromVercel() throws Exception {
        mockMvc.perform(options("/api/reports")
                        .header(HttpHeaders.ORIGIN, "https://whistledrop-teal.vercel.app")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Content-Type,Authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://whistledrop-teal.vercel.app"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));
    }
}
