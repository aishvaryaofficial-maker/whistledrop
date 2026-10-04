package com.whistledrop.entity;

public enum ReportCategory {
    SECURITY("Security Vulnerability or Incident"),
    HARASSMENT("Harassment or Bullying"),
    CORRUPTION("Corruption, Fraud or Financial Malpractice"),
    TECHNICAL("Technical System Failure or Bug"),
    OTHER("Other Concern");

    private final String displayName;

    ReportCategory(String displayName) {
        this.displayName = displayName;
    }

    public String displayName() {
        return displayName;
    }
}
