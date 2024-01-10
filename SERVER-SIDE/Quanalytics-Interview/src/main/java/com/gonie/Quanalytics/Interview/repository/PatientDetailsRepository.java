package com.gonie.Quanalytics.Interview.repository;

import com.gonie.Quanalytics.Interview.model.PatientDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PatientDetailsRepository extends JpaRepository<PatientDetails, Long> {

    @Query ("SELECT p FROM PatientDetails p WHERE firstName LIKE %:firstName%")
    List<PatientDetails> findByFirstName(String firstName);

    @Query("SELECT p FROM PatientDetails p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))")
    Page<PatientDetails> findByFirstNamePageable(@Param("firstName") String firstName, Pageable pageable);


    List<PatientDetails> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);;

    List<PatientDetails> findByFirstNameContainingIgnoreCase(String firstName);
}
