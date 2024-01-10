package com.gonie.Quanalytics.Interview.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PatientVisits {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @PastOrPresent(message = "Visit date should be today or in past")
    private LocalDate visitDate;

    @NotNull(message = "Height cannot be null")
    @DecimalMin(value = "30", message = "Height must be greater than or equal to 50")
    @DecimalMax(value = "250", message = "Height must be less than or equal to 250")
    private double height;

    @NotNull(message = "Weight cannot be null")
    @DecimalMin(value = "5", message = "Weight must be greater than or equal to 5")
    @DecimalMax(value = "500", message = "Weight must be less than or equal to 500")
    private double weight;

    private double bmi;

    private String generalHealth;
    private String weightLoose;

    private String onDrugs;
    private String comments;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private PatientDetails patient;


    public void calculateBmi(){
        double heightInMeters = this.height/100.0;
        double numberToRound =(this.weight/((heightInMeters)*(heightInMeters)));
        BigDecimal bmiToRound = new BigDecimal(numberToRound);
        bmiToRound = bmiToRound.setScale(2, BigDecimal.ROUND_HALF_UP);
        this.bmi = bmiToRound.doubleValue();
    }
    public void setHeight(double height) {
        this.height = height;
        calculateBmi();
    }

    public void setWeight(double weight) {
        this.weight = weight;
        calculateBmi();
    }
}
