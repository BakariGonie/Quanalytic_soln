package com.gonie.Quanalytics.Interview.controller;


import com.gonie.Quanalytics.Interview.exception.NoPatientFoundException;
import com.gonie.Quanalytics.Interview.model.PatientDetails;
import com.gonie.Quanalytics.Interview.response.PatientResponse;
import com.gonie.Quanalytics.Interview.service.IPatientDetailsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;



import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/patients")
public class PatientDetailsController {

    private final IPatientDetailsService patientService;
    @GetMapping("/all-patients")
    public ResponseEntity <List<PatientResponse>> getAllPatients(){
        List <PatientDetails> patients = patientService.getAllPatients();
        List <PatientResponse> patientResponses = new ArrayList<>();

        for (PatientDetails patient: patients) {
            PatientResponse patientResponse = getPatientResponse(patient);
            patientResponses.add(patientResponse);
        }

        return ResponseEntity.ok(patientResponses);
    }
    @GetMapping("/all-patients-with-params")
    public ResponseEntity<Page<PatientResponse>> getAllPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<PatientDetails> patientsPage = patientService.getAllPatientsPaged(pageable);

        List<PatientResponse> patientResponses = patientsPage.getContent()
                .stream()
                .map(this::getPatientResponse)
                .collect(Collectors.toList());

        long totalPatients = patientService.getTotalPatients(); // Get the total number of patients

        int totalPages = (int) Math.ceil((double) totalPatients / size);

        return ResponseEntity.ok(new PageImpl<>(patientResponses, pageable, patientsPage.getTotalElements()));
    }


    @GetMapping("/first-name/{firstName}")
    public ResponseEntity <List<PatientResponse>> retrievePatientByFirstName(@PathVariable("firstName") String firstName){
        List <PatientDetails> thepatients = patientService.getAllPatientsByFirstName(firstName);
        List <PatientResponse> patientResponses = new ArrayList<>();
            for (PatientDetails patient: thepatients) {
                PatientResponse patientResponse = getPatientResponse(patient);
                patientResponses.add(patientResponse);
            }
            return ResponseEntity.ok(patientResponses);

    }
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Optional<PatientResponse>> getRoomById(@PathVariable Long patientId){
        Optional<PatientDetails> thePatient = patientService.getPatientById(patientId);
        return thePatient.map(patient -> {
            PatientResponse patientResponse = getPatientResponse(patient);
            return  ResponseEntity.ok(Optional.of(patientResponse));
        }).orElseThrow(() -> new NoPatientFoundException("patient not found"));
    }

    @GetMapping("/first-name-with-params/{firstName}")
    public ResponseEntity<Page<PatientResponse>> retrievePatientByFirstName(
            @PathVariable("firstName") String firstName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<PatientDetails> patientsPage = patientService.getAllPatientsByFirstNamePaged(firstName, pageable);

        List<PatientResponse> patientResponses = patientsPage.getContent()
                .stream()
                .map(this::getPatientResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new PageImpl<>(patientResponses, pageable, patientsPage.getTotalElements()));
    }


    @PostMapping("/new-patient")
    public ResponseEntity<String> createNewPatient(@Valid @RequestBody PatientDetails patient){
        patientService.createPatient(patient);
        return ResponseEntity.ok("Registered successfully");
    }
    @GetMapping("/patient-fullnames")
    public ResponseEntity<List<PatientResponse>> getPatientFullNames(
            @RequestParam(name = "query", required = false) String query) {
        List<PatientDetails> patients;
        if (query != null && !query.isEmpty()) {
            // Split the query into first name and last name
            String[] names = query.split("\\s+", 2);

            if (names.length == 1) {
                // Search by first name only
                patients = patientService.getPatientsByFirstNameContaining(names[0]);
            } else {
                // Search by both first and last names
                patients = patientService.getPatientsByFullNameContaining(query);
            }
        } else {
            // If no query, get all patients
            patients = patientService.getAllPatients();
        }

        List<PatientResponse> patientResponses = patients.stream()
                .map(this::getPatientResponseWithFullName)
                .collect(Collectors.toList());
        return ResponseEntity.ok(patientResponses);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<String> updatePatient(@PathVariable Long id,
                                                      @Valid @RequestBody PatientDetails patient){
            PatientDetails thePatient = patientService.updatePatient(id, patient);
            return ResponseEntity.ok("Updated successfully");

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable Long id){
        try{
            patientService.deletePatient(id);
            return ResponseEntity.ok("Patient deleted successfully");
        }catch (NoPatientFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting Patient: " + e.getMessage());
        }
    }


    private PatientResponse getPatientResponse(PatientDetails patient) {
        return new PatientResponse(patient.getId(), patient.getFirstName(), patient.getLastName(),
                patient.getDob(), patient.getGender(), patient.getDateRegistered());
    }

    private PatientResponse getPatientResponseWithFullName(PatientDetails patient) {
        PatientResponse patientResponse = getPatientResponse(patient);
        // Set the fullName field using the existing fullName generation logic
        patientResponse.setFullName(generateFullName(patient.getFirstName(), patient.getLastName()));
        return patientResponse;
    }

    private String generateFullName(String firstName, String lastName) {
        return firstName + " " + lastName;
    }

}
