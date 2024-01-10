package com.gonie.Quanalytics.Interview.response;

import com.gonie.Quanalytics.Interview.model.PatientVisits;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class PatientResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String gender;
    private LocalDate dateRegistered;
    private List<PatientVisits> visits;
    private String fullName;

    public PatientResponse(Long id, String firstName, String lastName, LocalDate dob, String gender, LocalDate dateRegistered) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.dateRegistered = dateRegistered;
    }

    public PatientResponse(Long id, String firstName, String lastName, LocalDate dob, String gender, LocalDate dateRegistered, List<PatientVisits> visits) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.dateRegistered = dateRegistered;
        this.visits = visits;
        this.fullName = generateFullName(firstName, lastName);
    }

    private String generateFullName(String firstName, String lastName) {
        // Concatenate firstName and lastName to get the full name
        return firstName + " " + lastName;
    }
}
