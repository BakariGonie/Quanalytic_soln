package com.gonie.Quanalytics.Interview.service;

import com.gonie.Quanalytics.Interview.model.PatientDetails;
import com.gonie.Quanalytics.Interview.repository.PatientDetailsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientDetailsService implements IPatientDetailsService{

    private final PatientDetailsRepository patientRepository;

    @Override
    public List<PatientDetails> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public PatientDetails createPatient(PatientDetails patient) {
        patient.setFirstName(patient.getFirstName());
        patient.setLastName(patient.getLastName());
        patient.setDob(patient.getDob());
        patient.setGender(patient.getGender());
        patient.setDateRegistered(patient.getDateRegistered());
        return patientRepository.save(patient);
    }

    @Override
    public List<PatientDetails> getAllPatientsByFirstName(String firstName) {
        return patientRepository.findByFirstName(firstName);
    }




    @Transactional
    @Override
    public void deletePatient(Long id) {
        Optional<PatientDetails> patient = getPatientById(id);
        if(patient!=null){
            patientRepository.deleteById(id);
        }
    }

    @Override
    public PatientDetails updatePatient(Long id, PatientDetails patient) {
        patient.setId(id);
        patient.setFirstName(patient.getFirstName());
        patient.setLastName(patient.getLastName());
        patient.setDob(patient.getDob());
        patient.setGender(patient.getGender());
        patient.setDateRegistered(patient.getDateRegistered());
        return patientRepository.save(patient);
    }

    @Override
    public Page<PatientDetails> getAllPatientsPaged(Pageable pageable) {
        return patientRepository.findAll(pageable);

    }

    @Override
    public long getTotalPatients() {
        return patientRepository.count();
    }

    @Override
    public Page<PatientDetails> getAllPatientsByFirstNamePaged(String firstName, Pageable pageable) {
        return patientRepository.findByFirstNamePageable(firstName, pageable);
    }

    @Override
    public Optional<PatientDetails> getPatientById(Long patientId) {
        return patientRepository.findById(patientId);
    }

    @Override
    public List<PatientDetails> getPatientsByFullNameContaining(String query) {
        String lowercaseQuery = query.toLowerCase();
        return patientRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(lowercaseQuery, lowercaseQuery);
    }

    @Override
    public List<PatientDetails> getPatientsByFirstNameContaining(String firstName) {
        return patientRepository.findByFirstNameContainingIgnoreCase(firstName);
    }

}
