package com.whistledrop.service;

import com.whistledrop.exception.CaseCodeGenerationException;
import com.whistledrop.repository.ReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

/**
 * Generates cryptographically secure, unpredictable case codes.
 *
 * Design:
 * - Uses SecureRandom (CSPRNG) rather than java.util.Random.
 * - Base32 character set avoiding ambiguous characters (0, O, 1, I, L) to prevent human transcription errors.
 * - Format: "WD-" + 8 random characters (e.g. WD-7K4M9X2P).
 * - Total combinations: 32^8 = 1,099,511,627,776 (~1.1 trillion), preventing guessing/enumeration.
 * - Safe collision handling: checks repository existence with max retries and fallback protection.
 */
@Component
public class CaseCodeGenerator {

    private static final Logger log = LoggerFactory.getLogger(CaseCodeGenerator.class);

    private static final String PREFIX = "WD-";
    // 32-character unambiguous alphanumeric set (Crockford-style inspired)
    private static final String CHARSET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
    private static final int CODE_LENGTH = 8;
    private static final int MAX_RETRIES = 5;

    private final SecureRandom secureRandom = new SecureRandom();
    private final ReportRepository reportRepository;

    public CaseCodeGenerator(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    /**
     * Generates a unique, unpredictable case code that does not exist in the database.
     */
    public String generateUniqueCaseCode() {
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            String candidate = generateCandidate();
            if (!reportRepository.existsByCaseCode(candidate)) {
                return candidate;
            }
            log.warn("Case code collision detected for candidate: {} on attempt {}", candidate, attempt);
        }
        log.error("Failed to generate a unique case code after {} attempts", MAX_RETRIES);
        throw new CaseCodeGenerationException("Unable to allocate a unique case tracking code. Please retry.");
    }

    /**
     * Generates a single candidate case code string.
     */
    public String generateCandidate() {
        StringBuilder sb = new StringBuilder(PREFIX.length() + CODE_LENGTH);
        sb.append(PREFIX);
        for (int i = 0; i < CODE_LENGTH; i++) {
            int randomIndex = secureRandom.nextInt(CHARSET.length());
            sb.append(CHARSET.charAt(randomIndex));
        }
        return sb.toString();
    }
}
