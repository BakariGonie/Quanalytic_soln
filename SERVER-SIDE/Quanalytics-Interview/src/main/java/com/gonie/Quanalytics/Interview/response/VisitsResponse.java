package com.gonie.Quanalytics.Interview.response;


import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VisitsResponse {
    private Long id;
    private LocalDate visitDate;

    private double height;
    private double weight;

    private double bmi;

    private String generalHealth;
    private String weightLoose;

    private String onDrugs;
    private String comments;
    private PatientResponse patient;

    public VisitsResponse(Long id, @PastOrPresent(message = "Visit date should be today or in past") LocalDate visitDate, @NotNull(message = "Height cannot be null") @DecimalMin(value = "30", message = "Height must be greater than or equal to 50") @DecimalMax(value = "250", message = "Height must be less than or equal to 250") double height, @NotNull(message = "Weight cannot be null") @DecimalMin(value = "5", message = "Weight must be greater than or equal to 5") @DecimalMax(value = "500", message = "Weight must be less than or equal to 500") double weight, BigDecimal bmi, String generalHealth, String weightLoose, String onDrugs, String comments, PatientResponse patient) {
        this.id = id;
        this.patient = patient;
    }
}
