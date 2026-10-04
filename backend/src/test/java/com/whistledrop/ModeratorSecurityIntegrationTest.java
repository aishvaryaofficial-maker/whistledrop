package com.whistledrop;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.whistledrop.dto.request.LoginRequest;
import com.whistledrop.dto.request.UpdateStatusRequest;
import com.whistledrop.entity.ReportStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ModeratorSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/moderator/reports - Unauthenticated request must return 401 Unauthorized")
    void shouldDenyUnauthenticatedAccessToModeratorEndpoints() throws Exception {
        mockMvc.perform(get("/api/moderator/reports"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Authentication required")));
    }

    @Test
    @DisplayName("POST /api/auth/login - Valid moderator credentials should yield JWT token")
    void shouldAuthenticateModeratorAndReturnJwt() throws Exception {
        LoginRequest loginRequest = new LoginRequest("moderator", "Admin@12345");

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.username", is("moderator")))
                .andReturn();

        // Extract token and verify protected endpoint access
        String json = result.getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        String token = root.path("data").path("token").asText();

        mockMvc.perform(get("/api/moderator/reports")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/auth/login - Invalid credentials should return 401 Unauthorized")
    void shouldRejectInvalidCredentials() throws Exception {
        LoginRequest badLogin = new LoginRequest("moderator", "WrongPassword999!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badLogin)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Invalid username or password")));
    }

    @Test
    @DisplayName("PATCH /api/moderator/reports/{caseCode}/status - Authenticated moderator can update status")
    void shouldAllowStatusUpdateWithToken() throws Exception {
        // Log in to get token
        LoginRequest loginRequest = new LoginRequest("moderator", "Admin@12345");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn();

        JsonNode root = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = root.path("data").path("token").asText();

        // Use the seeded sample report WD-9K4M8X2P
        UpdateStatusRequest statusReq = new UpdateStatusRequest(
                ReportStatus.RESOLVED,
                "Audit confirmed remediation completed and permissions audited."
        );

        mockMvc.perform(patch("/api/moderator/reports/WD-9K4M8X2P/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("RESOLVED")));
    }
}
