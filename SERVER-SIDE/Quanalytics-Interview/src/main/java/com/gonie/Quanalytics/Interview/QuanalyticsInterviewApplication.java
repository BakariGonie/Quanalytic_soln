package com.gonie.Quanalytics.Interview;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication
@ComponentScan(basePackages = "com.gonie.Quanalytics.Interview")

public class QuanalyticsInterviewApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuanalyticsInterviewApplication.class, args);
	}

}
