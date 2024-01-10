package com.gonie.Quanalytics.Interview.repository;

import com.gonie.Quanalytics.Interview.model.PatientVisits;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PatientVisitsRepository extends JpaRepository<PatientVisits, Long> {

    @Query("SELECT v FROM PatientVisits v where v.patient.id = :patientId")
    List<PatientVisits> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT v FROM PatientVisits v where v.patient.id = :patientId")
    Page<PatientVisits> findAllVisitsByPatientId(Long patientId, Pageable pageable);

    @Query(" SELECT v FROM PatientVisits v WHERE LOWER(v.patient.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))")
    Page<PatientVisits> findAllVisitsByPatientFirstName(String firstName, Pageable pageable);

    List<PatientVisits> findAllByVisitDate(LocalDate visitDate);
}
