import React, { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getVisitByVisitDate } from "../utils/ApiFunctions";

const VisitReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visits, setVisits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calculate age function based on birthdate
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Get BMI status based on BMI value
  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) {
      return "Underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
      return "Normal";
    } else {
      return "Overweight";
    }
  };

  // Use useCallback to memoize the fetchVisits function
  const fetchVisits = useCallback(async () => {
    try {
      setLoading(true);
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const visitData = await getVisitByVisitDate(formattedDate);
      console.log(visitData);
      setVisits(visitData);
      setError(null);
    } catch (error) {
      setError(`Error fetching visit data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      fetchVisits();
    }
  }, [selectedDate, fetchVisits]);

  return (
    <section className="mt-5 mb-5 container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2 className="text-center mb-4">Patient Visit Report</h2>
        </div>
        <div className="col-md-3">
          <div className="text-right">
            {/* Date picker for selecting visit date */}
            <label htmlFor="visitDate" className="form-label">
              Select Visit Date:
            </label>
            <DatePicker
              id="visitDate"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </div>
        </div>
      </div>
  
      {loading && <p className="text-info">Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
  
      {/* Render table only if a date is selected */}
      {selectedDate && (
        <table className="table table-bordered table-hover mt-3">
          <thead>
            <tr className="text-center">
              <th>Full Name</th>
              <th>Age</th>
              <th>BMI Status</th>
            </tr>
          </thead>
  
          <tbody>
            {Array.isArray(visits) && visits.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  No visits found for the selected date.
                </td>
              </tr>
            )}
            {Array.isArray(visits) &&
              visits.map((visit) => (
                <tr key={visit.id} className="text-center">
                  <td>
                    {visit.patient.firstName} {visit.patient.lastName}
                  </td>
                  <td>{calculateAge(visit.patient.dob)}</td>
                  <td>{getBMIStatus(visit.bmi)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default VisitReport;
