package com.gonie.Quanalytics.Interview.service;

import com.gonie.Quanalytics.Interview.common.BMICalculator;
import org.springframework.stereotype.Service;

@Service
public class BMIService implements IBMIService{
    private final BMICalculator bmiCalculator;

    public BMIService(BMICalculator bmiCalculator) {
        this.bmiCalculator = bmiCalculator;
    }

    @Override
    public double calculateBMI(double weight, double height) {
        return bmiCalculator.calculateBMI(weight, height);
    }
}
