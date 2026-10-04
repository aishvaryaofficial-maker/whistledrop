-- WhistleDrop MySQL Schema Definition
-- GDG on Campus SRM Technical Recruitment Task

CREATE DATABASE IF NOT EXISTS whistledrop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE whistledrop;

-- 1. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_code VARCHAR(32) NOT NULL UNIQUE,
    category VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    evidence_url VARCHAR(1000) NULL,
    status VARCHAR(32) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_reports_case_code (case_code),
    INDEX idx_reports_status (status),
    INDEX idx_reports_category (category),
    INDEX idx_reports_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Status Updates Table
CREATE TABLE IF NOT EXISTS status_updates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT NOT NULL,
    status VARCHAR(32) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_status_updates_report
        FOREIGN KEY (report_id) REFERENCES reports(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    INDEX idx_status_updates_report_id (report_id),
    INDEX idx_status_updates_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Moderators Table
CREATE TABLE IF NOT EXISTS moderators (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'ROLE_MODERATOR',
    created_at DATETIME NOT NULL,
    INDEX idx_moderators_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
