package com.gonie.Quanalytics.Interview.common;

import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;


@Component
public class BMICalculator{
    public double calculateBMI(double weight, double height) {
        if (weight <= 0 || height <= 0) {
            throw new IllegalArgumentException("Weight and height must be positive values.");
        }
        // Calculate BMI
        double heightInMeters = height/100.0;
        double numberToRound =(weight/((heightInMeters)*(heightInMeters)));
        BigDecimal bmiToRound = new BigDecimal(numberToRound);
        bmiToRound = bmiToRound.setScale(2, BigDecimal.ROUND_HALF_UP);
        double bmi = bmiToRound.doubleValue();

        //return bmi
        return bmi;
    }
}
