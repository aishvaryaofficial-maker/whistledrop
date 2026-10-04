package com.whistledrop.repository;

import com.whistledrop.entity.Report;
import com.whistledrop.entity.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long>, JpaSpecificationExecutor<Report> {

    Optional<Report> findByCaseCode(String caseCode);

    boolean existsByCaseCode(String caseCode);

    long countByStatus(ReportStatus status);

    @Query("SELECT r FROM Report r LEFT JOIN FETCH r.statusUpdates WHERE r.caseCode = :caseCode")
    Optional<Report> findByCaseCodeWithUpdates(String caseCode);
}
