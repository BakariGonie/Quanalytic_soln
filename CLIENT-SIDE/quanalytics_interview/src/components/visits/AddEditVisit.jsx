import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import {
  AddNewVisitApi,
  SearchAndDisplayPatientsApi,
  calculateBMI,
  getVisitById,
  updateVisit,
} from "../utils/ApiFunctions";
import VisitDetailsForm from "./VisitDetailsForm";

const AddEditVisit = () => {
  const { visitId, patientId } = useParams();
  const isEditMode = !!visitId;

  const [newVisit, setNewVisit] = useState({
    visitDate: moment().format("YYYY-MM-DD"),
    height: "",
    weight: "",
    bmi: "",
    generalHealth: "",
    weightLoose: "",
    onDrugs: "",
    comments: "",
    patientId: "",
    visitId: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetDetails, setResetDetails] = useState(false);

  const [bmiCategory, setBmiCategory] = useState(0);
  const [searchedPatients, setSearchedPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formValid, setFormValid] = useState(true);
  const [currentInput, setCurrentInput] = useState("");
    const navigate = useNavigate();

  const calculateAndSetBMI = useCallback(async () => {
    try {
      const bmiValue = await calculateBMI(newVisit.weight, newVisit.height);
      setNewVisit((prevVisit) => ({ ...prevVisit, bmi: bmiValue }));

      if (bmiValue < 25) {
        setBmiCategory(0);
      } else {
        setBmiCategory(1);
      }
    } catch (error) {
      console.error("Error calculating BMI:", error);
    }
  }, [newVisit.weight, newVisit.height]);

  useEffect(() => {
    calculateAndSetBMI();
  }, [calculateAndSetBMI]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditMode) {
          const visitData = await getVisitById(visitId);
          setNewVisit({ ...visitData });
        } else {
          const currentDate = new Date().toISOString().split("T")[0];
          setNewVisit((prevVisitData) => ({
            ...prevVisitData,
            visitDate: currentDate,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isEditMode, visitId]);

  const handleVisitInputChange = (name, value) => {
    setNewVisit((prevVisit) => ({ ...prevVisit, [name]: value }));
  };

  const handleDetailsChange = (updatedDetails) => {
    setNewVisit((prevVisit) => ({ ...prevVisit, ...updatedDetails }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!patientId && !visitId && !newVisit.patientId) {
        setErrorMessage("Please select a patient.");
        return;
      }

      // Basic form validation for height and weight
      if (!newVisit.height || !newVisit.weight) {
        setErrorMessage("Please enter valid values for height and weight.");
        setFormValid(false);
        return;
      }

      const success = await (isEditMode
        ? updateVisit(visitId, patientId || newVisit.patientId, newVisit)
        : AddNewVisitApi(patientId || newVisit.patientId, newVisit));

      if (success !== undefined) {
        setSuccessMessage(
          isEditMode
            ? "Visit updated successfully!"
            : "A visit was booked successfully!"
        );
        clearForm();
        setErrorMessage("");
        setFormValid(true);
      } else {
        setErrorMessage(
          isEditMode ? "Error updating visit" : "Error booking new visit"
        );
      }
    } catch (error) {
      setErrorMessage(error.message);
    }

    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const clearForm = () => {
    setNewVisit({
      visitDate: moment().format("YYYY-MM-DD"),
      height: "",
      weight: "",
      bmi: "",
      generalHealth: "",
      weightLoose: "",
      onDrugs: "",
      comments: "",
      patientId: "",
      visitId: "",
    });
    setResetDetails(true);
    setTimeout(() => setResetDetails(false), 0);
  };

  const handleReset = () => {
    clearForm();
    setResetDetails(true);
    setTimeout(() => setResetDetails(false), 0);
  };

  // Inside the fetchData function or wherever you are processing patient data
  const fetchData = useCallback(async () => {
    try {
      const response = await SearchAndDisplayPatientsApi("");
      const formattedPatients = response.map((patient) => {
        // Check if 'fullName' is a valid property before using it
        if (patient.hasOwnProperty("fullName")) {
          return {
            value: patient.id,
            label: String(patient.fullName),
          };
        } else {
          console.error(
            'Patient object does not have a valid "fullName" property:',
            patient
          );
          // You can decide how to handle this case, e.g., return a default label
          return {
            value: patient.id,
            label: "Unknown Patient",
          };
        }
      });
      setSearchedPatients(formattedPatients);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setErrorMessage("Error fetching patient data. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const trimString = (str) => {
    if (typeof str !== "string") {
      return "";
    }
    return str.replace(/^\s+|\s+$/g, "");
  };

  const filterOption = ({ label }, inputValue) => {
    const trimmedInput = trimString(inputValue);
    const trimmedLabel = trimString(label);

    return trimmedLabel.toLowerCase().includes(trimmedInput.toLowerCase());
  };

  const handleSearchChange = async (inputValue) => {
    try {
      setIsLoading(true);

      // Save the input value to the search term state
      setCurrentInput((prevInput) => prevInput + inputValue);
      // Make the API call with the accumulated search term
      const searchResults = await SearchAndDisplayPatientsApi(currentInput);

      if (searchResults.length === 0) {
        setErrorMessage("No patients found.");

        // Add an option to register a new patient dynamically
        const newPatientOption = {
          value: "newPatient",
          label: `Register New Patient: ${inputValue}`,
        };

        setSearchedPatients([newPatientOption]);
      } else {
        setErrorMessage("");
        setSearchedPatients(
          searchResults.map((patient) => ({
            value: patient.id,
            label: String(patient.fullName),
          }))
        );
      }
    } catch (error) {
      console.error("Error searching and displaying patients:", error);
      setErrorMessage(
        `Error searching and displaying patients: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h2 className="text-center mt-5 mb-4">
              {isEditMode ? "Update Visit" : "Book New Visit"}
            </h2>

            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            {/* Conditionally render the search input based on the search term */}
            {currentInput && (
              <div className="mb-3">
                <label className="form-label">Search Input</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentInput}
                  readOnly
                />
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Inside the render method*/}
              {!patientId && !visitId && (
                <div className="mb-3">
                  <label className="form-label">Select Patient</label>
                  {isLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <Select
                      options={searchedPatients}
                      onInputChange={handleSearchChange}
                      value={searchedPatients.find(
                        (option) => option.value === newVisit.patientId
                      )}
                      onChange={(selectedOption) => {
                        if (
                          selectedOption &&
                          selectedOption.value === "newPatient"
                        ) {
                          navigate("/add-patient");
                        } else {
                          setNewVisit((prevVisit) => ({
                            ...prevVisit,
                            patientId: selectedOption
                              ? selectedOption.value
                              : "",
                          }));
                        }
                      }}
                      isSearchable
                      filterOption={filterOption}
                      placeholder="Search or select a patient"
                    />
                  )}
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Visit Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={newVisit.visitDate}
                  onChange={(e) =>
                    handleVisitInputChange("visitDate", e.target.value)
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Height (in cm)</label>
                <input
                  type="number"
                  className={`form-control ${!formValid ? "is-invalid" : ""}`}
                  value={newVisit.height}
                  onChange={(e) =>
                    handleVisitInputChange("height", e.target.value)
                  }
                  required
                />
                {!formValid && (
                  <div className="invalid-feedback">
                    Please enter a valid height.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Weight (in kg)</label>
                <input
                  type="number"
                  className={`form-control ${!formValid ? "is-invalid" : ""}`}
                  value={newVisit.weight}
                  onChange={(e) =>
                    handleVisitInputChange("weight", e.target.value)
                  }
                  required
                />
                {!formValid && (
                  <div className="invalid-feedback">
                    Please enter a valid weight.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">BMI</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    typeof newVisit.bmi === "number"
                      ? newVisit.bmi.toFixed(2)
                      : newVisit.bmi
                  }
                  readOnly
                />
              </div>
              {bmiCategory === 0 && (
                <VisitDetailsForm
                  generalHealth={newVisit.generalHealth}
                  weightLoose={newVisit.weightLoose}
                  comments={newVisit.comments}
                  bmiCategory={bmiCategory}
                  onDetailsChange={handleDetailsChange}
                  resetDetails={resetDetails}
                />
              )}
              {bmiCategory === 1 && (
                <VisitDetailsForm
                  generalHealth={newVisit.generalHealth}
                  onDrugs={newVisit.onDrugs}
                  comments={newVisit.comments}
                  bmiCategory={bmiCategory}
                  onDetailsChange={handleDetailsChange}
                  resetDetails={resetDetails}
                />
              )}
              <div className="d-grid gap-2 d-md-flex mt-2">
                {!isEditMode && (
                  <button
                    type="button"
                    className="btn btn-patient ml-5"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                )}

                <Link to="/patient-visit" className="btn btn-outline-info">
                  Visit List
                </Link>
                <button type="submit" className="btn btn-outline-primary ml-5">
                  {isEditMode ? "Update Visit" : "Book Visit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddEditVisit;
