package com.whistledrop.controller;

import com.whistledrop.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@Tag(name = "System Status", description = "Public health, information, and status check endpoints")
public class RootController {

    @GetMapping("/")
    @Operation(
            summary = "Root API status",
            description = "Public status endpoint confirming the WhistleDrop backend is running and operational"
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> rootStatus() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("service", "WhistleDrop Anonymous Reporting API");
        info.put("status", "UP");
        info.put("version", "1.0.0");
        info.put("documentation", "/swagger-ui.html");
        info.put("intakeEndpoint", "/api/reports");
        return ResponseEntity.ok(ApiResponse.success("WhistleDrop Backend API is operational", info));
    }

    @GetMapping({"/api/health", "/health"})
    @Operation(
            summary = "Health check",
            description = "Health check probe for container monitoring and platform readiness"
    )
    public ResponseEntity<ApiResponse<Map<String, String>>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Healthy", Map.of("status", "UP")));
    }
}
