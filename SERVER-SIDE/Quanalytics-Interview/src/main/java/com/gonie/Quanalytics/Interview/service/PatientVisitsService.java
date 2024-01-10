package com.gonie.Quanalytics.Interview.service;

import com.gonie.Quanalytics.Interview.exception.InvalidVisitRequestException;
import com.gonie.Quanalytics.Interview.model.PatientDetails;
import com.gonie.Quanalytics.Interview.model.PatientVisits;
import com.gonie.Quanalytics.Interview.repository.PatientVisitsRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientVisitsService implements IPatientVisitsService{

    private final PatientVisitsRepository visitsRepository;
    private final IPatientDetailsService patientService;


    @Override
    public List<PatientVisits> getAllVisits() {
        return visitsRepository.findAll();
    }

    @Override
    public List<PatientVisits> getVisitsByPatientId(Long patientId) {
        return visitsRepository.findByPatientId(patientId);
    }

    @Override
    public void cancelVisit(Long id) {
        visitsRepository.deleteById(id);
    }

    @Override
    public void saveVisit(Long patientId, PatientVisits visitsRequest) {
        LocalDate currentDate = LocalDate.now();
        if(visitsRequest.getVisitDate().isAfter(currentDate)){
            throw new InvalidVisitRequestException("Visit date should not be in the past");
        }
        Optional<PatientDetails> patient = patientService.getPatientById(patientId);
        patient.get().addVisit(visitsRequest);
        visitsRepository.save(visitsRequest);
    }

    @Override
    public Page<PatientVisits> getAllVisitsPaged(Pageable pageable) {
        return visitsRepository.findAll(pageable);
    }

    @Override
    public long getTotalVisits() {
        return visitsRepository.count();
    }

    @Override
    public Page<PatientVisits> getAllVisitsByPatientIdPaged(Long patientId, Pageable pageable) {
        return visitsRepository.findAllVisitsByPatientId(patientId,pageable);
    }

    @Override
    public Page<PatientVisits> getAllVisitsByPatientFirstNamePaged(String firstName, Pageable pageable) {
        return visitsRepository.findAllVisitsByPatientFirstName(firstName,pageable);
    }

    @Override
    public Optional<PatientVisits> getVisitById(Long visitId) {
        return visitsRepository.findById(visitId);
    }


    @Override
    public PatientVisits updateVisit(Long id, long patientId, PatientVisits visit) {
        LocalDate currentDate = LocalDate.now();
        if (visit.getVisitDate().isAfter(currentDate)) {
            throw new InvalidVisitRequestException("Visit date should not be in the past");
        }

        Optional<PatientDetails> patientOptional = patientService.getPatientById(patientId);
        if (patientOptional.isEmpty()) {
            throw new EntityNotFoundException("Patient not found with id: " + patientId);
        }

        PatientDetails patient = patientOptional.get();

        Optional<PatientVisits> existingVisitOptional = visitsRepository.findById(id);
        if (existingVisitOptional.isEmpty()) {
            throw new EntityNotFoundException("Visit not found with id: " + id);
        }

        PatientVisits existingVisit = existingVisitOptional.get();

        // Update existing visit properties
        existingVisit.setVisitDate(visit.getVisitDate());
        existingVisit.setWeight(visit.getWeight());
        existingVisit.setHeight(visit.getHeight());
        existingVisit.setBmi(visit.getBmi());
        existingVisit.setGeneralHealth(visit.getGeneralHealth());
        existingVisit.setWeightLoose(visit.getWeightLoose());
        existingVisit.setOnDrugs(visit.getOnDrugs());
        existingVisit.setComments(visit.getComments());

        // Associate the visit with the patient
        patient.addVisit(existingVisit);

        // Save the updated visit
        return visitsRepository.save(existingVisit);
    }

    @Override
    public List<PatientVisits> getVisitsByVisitDate(LocalDate visitDate) {
        return visitsRepository.findAllByVisitDate(visitDate);
    }

}

