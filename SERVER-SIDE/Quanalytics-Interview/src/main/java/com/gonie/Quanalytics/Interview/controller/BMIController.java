package com.gonie.Quanalytics.Interview.controller;

import com.gonie.Quanalytics.Interview.common.BMICalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BMIController {
    private final BMICalculator bmiCalculator;

    @Autowired
    public BMIController(BMICalculator bmiCalculator) {
        this.bmiCalculator = bmiCalculator;
    }

    @GetMapping("/calculate-bmi")
    public double calculateBMI(
            @RequestParam(required = false) Double weight,
            @RequestParam(required = false) Double height) {

        // Allow empty or undefined values for initial request
        if (weight == null || height == null) {
            return 0.0; // Or another default value indicating the initial state
        }

        // Check if either weight or height is not positive
        if (weight <= 0 || height <= 0) {
            throw new IllegalArgumentException("Both weight and height must be positive values.");
        }

        // Use the BMI Calculator to calculate BMI
        double bmi = bmiCalculator.calculateBMI(weight, height);

        // Return the result
        return bmi;
    }

}