package com.gonie.Quanalytics.Interview.controller;


import com.gonie.Quanalytics.Interview.exception.InvalidVisitRequestException;
import com.gonie.Quanalytics.Interview.exception.NoPatientFoundException;
import com.gonie.Quanalytics.Interview.exception.NoVisitFoundException;
import com.gonie.Quanalytics.Interview.model.PatientDetails;
import com.gonie.Quanalytics.Interview.model.PatientVisits;
import com.gonie.Quanalytics.Interview.response.PatientResponse;
import com.gonie.Quanalytics.Interview.response.VisitsResponse;
import com.gonie.Quanalytics.Interview.service.IPatientDetailsService;
import com.gonie.Quanalytics.Interview.service.IPatientVisitsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/visits")
@RequiredArgsConstructor
public class PatientVisitsController {

    private final IPatientDetailsService patientsService;
    private final IPatientVisitsService visitsService;

    @GetMapping("/all-visits")
    public ResponseEntity<List<VisitsResponse>> getAllVisits(){
        List<PatientVisits> visits = visitsService.getAllVisits();
        List<VisitsResponse> visitsResponses = new ArrayList<>();
        for (PatientVisits visit : visits){
            VisitsResponse visitsResponse = getVisitResponse(visit);
            visitsResponses.add(visitsResponse);
        }
        return ResponseEntity.ok(visitsResponses);
    }

    @GetMapping("/all-visits-with-params")
    public ResponseEntity<Page<VisitsResponse>> getAllVisits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<PatientVisits> visitsPage = visitsService.getAllVisitsPaged(pageable);

        List<VisitsResponse> visitsResponses = visitsPage.getContent()
                .stream()
                .map(this::getVisitResponse)
                .collect(Collectors.toList());

        long totalPatients = visitsService.getTotalVisits(); // Get the total number of patients

        int totalPages = (int) Math.ceil((double) totalPatients / size);

        return ResponseEntity.ok(new PageImpl<>(visitsResponses, pageable, visitsPage.getTotalElements()));
    }

    @GetMapping("/{patient_id}/visits")
    public ResponseEntity<List<VisitsResponse>> findVisitsByPatientId(@PathVariable Long patient_id) {
        List<PatientVisits> visits = visitsService.getVisitsByPatientId(patient_id);
        List<VisitsResponse> visitsResponses = new ArrayList<>();
        for (PatientVisits visit : visits) {
            VisitsResponse visitsResponse = getVisitResponse(visit);
            visitsResponses.add(visitsResponse);
        }
        return ResponseEntity.ok(visitsResponses);
    }

    @GetMapping("/{patient_id}/visits-with-params")
    public ResponseEntity<PageImpl<VisitsResponse>> retrieveVisitsByPatientId(
            @PathVariable Long patient_id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<PatientVisits> visitsPage = visitsService.getAllVisitsByPatientIdPaged(patient_id, pageable);

        List<VisitsResponse> visitsResponses = visitsPage.getContent()
                .stream()
                .map(this::getVisitResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new PageImpl<>(visitsResponses, pageable, visitsPage.getTotalElements()));
    }
    @GetMapping("/first-name/{firstName}/visits-with-params")
    public ResponseEntity<PageImpl<VisitsResponse>> retrieveVisitsByPatientFirstName(
            @PathVariable ("firstName") String firstName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<PatientVisits> visitsPage = visitsService.getAllVisitsByPatientFirstNamePaged(firstName, pageable);

        List<VisitsResponse> visitsResponses = visitsPage.getContent()
                .stream()
                .map(this::getVisitResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new PageImpl<>(visitsResponses, pageable, visitsPage.getTotalElements()));
    }

    @GetMapping("/visit/{visitId}")
    public ResponseEntity<Optional<VisitsResponse>> retrieveVisitById(@PathVariable Long visitId){
        Optional<PatientVisits> theVisit = visitsService.getVisitById(visitId);
        return theVisit.map(visit -> {
            VisitsResponse visitsResponse = getVisitResponse(visit);
            return  ResponseEntity.ok(Optional.of(visitsResponse));
        }).orElseThrow(() -> new NoVisitFoundException("visit not found"));
    }
    @GetMapping("/report/{visitDate}")
    public ResponseEntity<List<VisitsResponse>> retrieveVisitByVisitDate(@PathVariable String visitDate) {
        try {
            LocalDate parsedDate = LocalDate.parse(visitDate);
            List<PatientVisits> visits = visitsService.getVisitsByVisitDate(parsedDate);
            List<VisitsResponse> visitsResponses = new ArrayList<>();
            for (PatientVisits visit : visits) {
                VisitsResponse visitsResponse = getVisitResponse(visit);
                visitsResponses.add(visitsResponse);
            }
            return ResponseEntity.ok(visitsResponses);
        } catch (DateTimeParseException ex) {
            // Handle invalid date format
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }


    @PostMapping("/{patientId}/add/visit")
    public ResponseEntity<?> saveVisit(@PathVariable Long patientId,
                                         @Valid @RequestBody PatientVisits visitsRequest){
        try{
            visitsService.saveVisit(patientId, visitsRequest);
            return ResponseEntity.ok(
                    "Visit created successfully");

        }catch (InvalidVisitRequestException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}/patient/{patientId}")
    public ResponseEntity<String> updateVisit(@PathVariable Long id, @PathVariable Long patientId,
                                                @Valid @RequestBody PatientVisits visit){
        PatientVisits theVisit = visitsService.updateVisit(id, patientId, visit);
        return ResponseEntity.ok("Updated successfully");

    }


    @DeleteMapping("/delete/{id}")
    public void cancelVisit(@PathVariable Long id){
        visitsService.cancelVisit(id);
    }

    private VisitsResponse getVisitResponse(PatientVisits visit) {
        Optional<PatientDetails> thePatient = patientsService.getPatientById(visit.getPatient().getId());
        PatientResponse patient = new PatientResponse(
                thePatient.get().getId(),
                thePatient.get().getFirstName(),
                thePatient.get().getLastName(),
                thePatient.get().getDob(),
                thePatient.get().getGender(),
                thePatient.get().getDateRegistered());
        return new VisitsResponse(
                visit.getId(),visit.getVisitDate(),
                visit.getHeight(),visit.getWeight(),
                visit.getBmi(), visit.getGeneralHealth(),
                visit.getWeightLoose(), visit.getOnDrugs(),
                visit.getComments(), patient);
    }

}
