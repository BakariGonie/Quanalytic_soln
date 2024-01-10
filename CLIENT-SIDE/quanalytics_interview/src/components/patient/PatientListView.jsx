import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import PatientPagination from "../common/PatientPagination";
import PatientSearchFilter from "../common/PatientSearchFilter";
import {
  deletePatient,
  getAllPatients,
  getPatientsByFirstName,
} from "../utils/ApiFunctions";

const PatientListView = () => {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    fetchPatients(currentPage, filter);
  }, [currentPage, filter]);

  const fetchPatients = async (page, filter) => {
    try {
      setLoading(true);
      setError(null);

      let patientsData;

      if (filter) {
        patientsData = await getPatientsByFirstName(filter, page, pageSize);
      } else {
        patientsData = await getAllPatients(page, pageSize);
      }

      setPatients(patientsData.content || []);
      setTotalPages(patientsData.totalPages || 1);
    } catch (error) {
      console.error("Error fetching patients", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to the first page when the filter changes
  };

  const handlePaginationChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDeletePatient = async (patientId) => {
    try {
      // Call the deletePatient function to delete a patient by ID
      await deletePatient(patientId);
      // After successful deletion, refetch the patients
      fetchPatients(currentPage, filter);
    } catch (error) {
      console.error("Error deleting patient", error);
    }
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <section className="mt-5 mb-5 container">
        <div className="d-flex justify-content-between mb-3 mt-5">
          <h2>Patient List</h2>
        </div>

        <Row>
          <Col md={6} className="mb-2 md-mb-0">
            <PatientSearchFilter onFilterChange={handleFilterChange} />
          </Col>

          <Col md={6} className="d-flex justify-content-end">
            <Link to={"/add-patient"}>
              <FaPlus /> Register Patient
            </Link>
          </Col>
        </Row>
        <table className="table table-bordered table-hover">
          <thead>
            <tr className="text-center">
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Date Registered</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(patients) &&
              patients.map((patient) => (
                <tr key={patient.id} className="text-center">
                  <td>{patient.id}</td>
                  <td>{patient.firstName}</td>
                  <td>{patient.lastName}</td>
                  <td>{patient.dob}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.dateRegistered}</td>
                  <td className="gap-2">
                    <Link
                      to={`/add-visit/${patient.id}`}
                      className="btn btn-success btn-sm"
                    >
                      <FaPlus />
                      <span className="ml-2">Book Visit</span>
                    </Link>
                    <Link to={`/edit-patient/${patient.id}`} className="gap-2">
                      <span className="btn btn-info btn-sm">
                        <FaEye />
                      </span>
                      <span className="btn btn-warning btn-sm ml-5">
                        <FaEdit />
                      </span>
                    </Link>
                    <button
                      className="btn btn-danger btn-sm ml-5"
                      onClick={() => handleDeletePatient(patient.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <PatientPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePaginationChange}
        />
      </section>
    </>
  );
};

export default PatientListView;
