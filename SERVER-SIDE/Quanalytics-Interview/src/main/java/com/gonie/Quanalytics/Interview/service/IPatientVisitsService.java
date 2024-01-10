package com.gonie.Quanalytics.Interview.service;

import com.gonie.Quanalytics.Interview.model.PatientVisits;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface IPatientVisitsService {
    List<PatientVisits> getAllVisits();

    List<PatientVisits> getVisitsByPatientId(Long patientId);

    void cancelVisit(Long id);

    void saveVisit(Long patientId, PatientVisits visitsRequest);

    Page<PatientVisits> getAllVisitsPaged(Pageable pageable);

    long getTotalVisits();

    Page<PatientVisits> getAllVisitsByPatientIdPaged(Long patientId, Pageable pageable);

    Page<PatientVisits> getAllVisitsByPatientFirstNamePaged(String firstName, Pageable pageable);

    Optional<PatientVisits> getVisitById(Long visitId);

    PatientVisits updateVisit(Long id, long patientId, PatientVisits visit);


    List<PatientVisits> getVisitsByVisitDate(LocalDate visitDate);
}
