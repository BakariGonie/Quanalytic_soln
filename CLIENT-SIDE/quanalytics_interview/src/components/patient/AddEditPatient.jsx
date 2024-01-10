import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GenderSelector from "../common/GenderSelector";
import {
    AddNewPatientApi,
    getPatientById,
    updatePatient,
} from "../utils/ApiFunctions";

const AddEditPatient = () => {
  const { patientId } = useParams();
  const isEditMode = !!patientId;

  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    dateRegistered: "",
  });
  const genderSelectorRef = useRef(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // If in edit mode, fetch patientData using the patientId and set it in the state
    if (isEditMode) {
      const fetchPatientData = async () => {
        try {
          const patientData = await getPatientById(patientId);
          setNewPatient({
            ...patientData,
            // Include gender explicitly to ensure it's prepopulated
            gender: patientData.gender,
          });
        } catch (error) {
          console.error("Error fetching patient data:", error);
        }
      };

      fetchPatientData();
    } else {
      // If in add mode, set the default value of dateRegistered to the current date
      const currentDate = new Date().toISOString().split("T")[0];
      setNewPatient((prevPatientData) => ({
        ...prevPatientData,
        dateRegistered: currentDate,
      }));
    }
  }, [isEditMode, patientId]);

  const handlePatientInputChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    setNewPatient({ ...newPatient, [name]: value });
  };

  const handleGenderChange = (selectedGender) => {
    setNewPatient({
      ...newPatient,
      gender: selectedGender,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await (isEditMode
        ? updatePatient(patientId, newPatient)
        : AddNewPatientApi(
            newPatient.firstName,
            newPatient.lastName,
            newPatient.dob,
            newPatient.gender,
            newPatient.dateRegistered
          ));

      if (success !== undefined) {
        setSuccessMessage(
          isEditMode
            ? "Patient updated successfully!"
            : "A patient was registered successfully!"
        );
        // Reset form fields after submission
        handleReset();
        setErrorMessage("");
      } else {
        setErrorMessage(
          isEditMode
            ? "Error updating patient"
            : "Error registering new patient"
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

  const handleReset = async () => {
    // If in edit mode, fetch patientData using the patientId and set it in the state
    if (isEditMode) {
      try {
        const patientData = await getPatientById(patientId); // Replace with your actual function
        setNewPatient(patientData);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    } else {
      // Reset form fields without submitting for new patient registration
      setNewPatient({
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
        dateRegistered: new Date().toISOString().split("T")[0], // Reset date to current date
      });
      // Access the reset button in GenderSelector and trigger its click event
      genderSelectorRef.current && genderSelectorRef.current.resetGender();
    }
  };

  return (
    <>
      <section className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h2 className="text-center mt-5 mb-2">
              {isEditMode ? "Edit Patient" : "Register New Patient"}
            </h2>
            {successMessage && (
              <div className="alert alert-success fade show">
                {" "}
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-danger fade show">
                {" "}
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    value={newPatient.firstName}
                    onChange={handlePatientInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    value={newPatient.lastName}
                    onChange={handlePatientInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="dob" className="form-label">
                    Date of birth
                  </label>
                  <input
                    required
                    type="date"
                    id="dob"
                    name="dob"
                    className="form-control"
                    value={newPatient.dob}
                    placeholder="dob"
                    min={moment().format("MMM Do, YYYY")}
                    onChange={handlePatientInputChange}
                  />
                </div>
                <div className="mb-3">
                  <div>
                    <GenderSelector
                      onGenderChange={handleGenderChange}
                      isResetButtonVisible={false}
                      ref={genderSelectorRef}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="dateRegistered" className="form-label">
                    date registered
                  </label>
                  <input
                    required
                    type="date"
                    id="dateRegistered"
                    name="dateRegistered"
                    className="form-control"
                    value={newPatient.dateRegistered}
                    placeholder="dateRegistered"
                    readOnly
                    min={moment().format("MMM Do, YYYY")}
                    onChange={handlePatientInputChange}
                  />
                </div>

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

                  <Link to="/patient-list" className="btn btn-outline-info">
                    Patient List
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-outline-primary ml-5"
                  >
                    {isEditMode ? "Update Patient" : "Register Patient"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddEditPatient;
