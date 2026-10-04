package com.whistledrop.config;

import com.whistledrop.entity.*;
import com.whistledrop.repository.ModeratorUserRepository;
import com.whistledrop.repository.ReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ModeratorUserRepository moderatorUserRepository;
    private final ReportRepository reportRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            ModeratorUserRepository moderatorUserRepository,
            ReportRepository reportRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.moderatorUserRepository = moderatorUserRepository;
        this.reportRepository = reportRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        initModerator();
        initSampleReportsIfEmpty();
    }

    private void initModerator() {
        String defaultUsername = "moderator";
        if (moderatorUserRepository.findByUsername(defaultUsername).isEmpty()) {
            ModeratorUser moderator = new ModeratorUser(
                    defaultUsername,
                    passwordEncoder.encode("Admin@12345"),
                    "ROLE_MODERATOR"
            );
            moderatorUserRepository.save(moderator);
            log.info("Default moderator account initialized: username='{}', password='{}'", defaultUsername, "Admin@12345");
        }
    }

    private void initSampleReportsIfEmpty() {
        if (reportRepository.count() == 0) {
            // Sample 1: Security
            Report r1 = new Report(
                    "WD-9K4M8X2P",
                    ReportCategory.SECURITY,
                    "Discovered an open Amazon S3 bucket belonging to the staging environment containing unencrypted database backups and environment secrets.",
                    "https://drive.example.com/s/s3-audit-report"
            );
            r1.setStatus(ReportStatus.UNDER_REVIEW);
            r1.addStatusUpdate(new StatusUpdate(r1, ReportStatus.SUBMITTED, "Report securely received and logged into WhistleDrop."));
            r1.addStatusUpdate(new StatusUpdate(r1, ReportStatus.UNDER_REVIEW, "Security response team notified. Bucket permissions restricted immediately."));
            reportRepository.save(r1);

            // Sample 2: Corruption / Procurement
            Report r2 = new Report(
                    "WD-3F7Y6T1R",
                    ReportCategory.CORRUPTION,
                    "Irregularities in the university vendor procurement contract for campus lab equipment. Winning bidder bid 35% higher than competing bids without transparent justification.",
                    null
            );
            r2.setStatus(ReportStatus.SUBMITTED);
            r2.addStatusUpdate(new StatusUpdate(r2, ReportStatus.SUBMITTED, "Report submitted anonymously. Pending review by audit committee."));
            reportRepository.save(r2);

            // Sample 3: Technical
            Report r3 = new Report(
                    "WD-8V2H5L9C",
                    ReportCategory.TECHNICAL,
                    "Exam portal experienced repeated session hijacking symptoms during midterm assessments where student tokens were improperly cached across public computer lab workstations.",
                    "https://pastebin.example.com/raw/session-logs"
            );
            r3.setStatus(ReportStatus.RESOLVED);
            r3.addStatusUpdate(new StatusUpdate(r3, ReportStatus.SUBMITTED, "Report submitted anonymously."));
            r3.addStatusUpdate(new StatusUpdate(r3, ReportStatus.UNDER_REVIEW, "Infrastructure team reproduced Redis session affinity configuration bug."));
            r3.addStatusUpdate(new StatusUpdate(r3, ReportStatus.RESOLVED, "Hotfix deployed to production. Redis session clustering key partitioned per IP and browser fingerprint."));
            reportRepository.save(r3);

            // Sample 4: Harassment
            Report r4 = new Report(
                    "WD-5B8N2Q7W",
                    ReportCategory.HARASSMENT,
                    "Hostile intimidation and verbal harassment in department lab hours by senior lab assistant towards junior team members during project review submissions.",
                    null
            );
            r4.setStatus(ReportStatus.UNDER_REVIEW);
            r4.addStatusUpdate(new StatusUpdate(r4, ReportStatus.SUBMITTED, "Report submitted anonymously."));
            r4.addStatusUpdate(new StatusUpdate(r4, ReportStatus.UNDER_REVIEW, "Escalated to student welfare committee for impartial review."));
            reportRepository.save(r4);

            log.info("Initialized 4 sample confidential reports with diverse statuses for immediate verification.");
        }
    }
}
