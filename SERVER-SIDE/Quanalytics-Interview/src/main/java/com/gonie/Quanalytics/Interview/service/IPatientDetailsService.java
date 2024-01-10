package com.gonie.Quanalytics.Interview.service;

import com.gonie.Quanalytics.Interview.model.PatientDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface IPatientDetailsService {
    List<PatientDetails> getAllPatients();

    PatientDetails createPatient(PatientDetails patient);

    List<PatientDetails> getAllPatientsByFirstName(String firstName);
    

    void deletePatient(Long id);

    PatientDetails updatePatient(Long id, PatientDetails patient);

    Page<PatientDetails> getAllPatientsPaged(Pageable pageable);

    long getTotalPatients();

    Page<PatientDetails> getAllPatientsByFirstNamePaged(String firstName, Pageable pageable);

    Optional<PatientDetails> getPatientById(Long patientId);

    List<PatientDetails> getPatientsByFullNameContaining(String query);

    List<PatientDetails> getPatientsByFirstNameContaining(String firstName);
}
