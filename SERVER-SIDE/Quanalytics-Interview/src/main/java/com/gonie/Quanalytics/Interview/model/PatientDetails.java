package com.gonie.Quanalytics.Interview.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Setter
@AllArgsConstructor
public class PatientDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Size(min=2, message = "First name should have atleast 2 characters")
    private String firstName;
    @Size(min=2, message = "last name should have atleast 2 characters")
    private String lastName;
    @Past(message = "Birth Date should be in the past")
    private LocalDate dob;
    private String gender;
    @PastOrPresent(message = "registration date should be today or in past")
    private LocalDate dateRegistered;

    @OneToMany(mappedBy="patient", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<PatientVisits> visits;



    public PatientDetails() {
        super();
        this.visits = visits;
    }

    public void addVisit(PatientVisits visit) {
        if (visits==null){
            visits = new ArrayList<>();
        }
        visits.add(visit);
        visit.setPatient(this);
    }
}
