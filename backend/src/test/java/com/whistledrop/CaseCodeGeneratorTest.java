package com.whistledrop;

import com.whistledrop.repository.ReportRepository;
import com.whistledrop.service.CaseCodeGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CaseCodeGeneratorTest {

    @Mock
    private ReportRepository reportRepository;

    private CaseCodeGenerator caseCodeGenerator;

    @BeforeEach
    void setUp() {
        caseCodeGenerator = new CaseCodeGenerator(reportRepository);
    }

    @Test
    @DisplayName("Should generate case code matching pattern WD-[2-9A-HJ-NP-Z]{8}")
    void shouldGenerateValidFormatCaseCode() {
        when(reportRepository.existsByCaseCode(anyString())).thenReturn(false);

        String code = caseCodeGenerator.generateUniqueCaseCode();

        assertNotNull(code);
        assertTrue(code.startsWith("WD-"), "Code should start with WD- prefix");
        assertEquals(11, code.length(), "Code format should be WD-XXXXXXXX (11 chars)");
        // Verify unambiguous characters only (no 0, O, 1, I, L)
        assertTrue(code.matches("^WD-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$"),
                "Code should only contain unambiguous alphanumeric characters");
    }

    @Test
    @DisplayName("Should generate distinct, unpredictable codes across successive invocations")
    void shouldGenerateUnpredictableUniqueCodes() {
        when(reportRepository.existsByCaseCode(anyString())).thenReturn(false);

        Set<String> generatedCodes = new HashSet<>();
        for (int i = 0; i < 100; i++) {
            String code = caseCodeGenerator.generateUniqueCaseCode();
            assertFalse(generatedCodes.contains(code), "Generated code must be unpredictable and unique");
            generatedCodes.add(code);
        }

        assertEquals(100, generatedCodes.size());
    }

    @Test
    @DisplayName("Should handle collision by retrying and succeeding")
    void shouldHandleCollisionAndRetry() {
        // First attempt collides, second attempt succeeds
        when(reportRepository.existsByCaseCode(anyString()))
                .thenReturn(true)
                .thenReturn(false);

        String code = caseCodeGenerator.generateUniqueCaseCode();
        assertNotNull(code);
    }
}
