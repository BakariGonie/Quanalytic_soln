import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import PatientPagination from "../common/PatientPagination";
import PatientSearchFilter from "../common/PatientSearchFilter";
import {
  cancelVisit,
  getAllVisits,
  getPatientVisitsByFirstName
} from "../utils/ApiFunctions";

const PatientsVisitsListView = () => {
  const [visits, setVisits] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    fetchVisits(currentPage, filter);
  }, [currentPage, filter]);

  const fetchVisits = async (page, filter) => {
    try {
      setLoading(true);
      setError(null);

      let visitsData;

      if (filter) {
        visitsData = await getPatientVisitsByFirstName(filter, page, pageSize);
      } else {
        visitsData = await getAllVisits(page, pageSize);
      }

      setVisits(visitsData.content || []);
      setTotalPages(visitsData.totalPages || 1);
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

  const handleDeleteVisit = async (visitId) => {
    try {
      // Call the deletePatient function to delete a patient by ID
      await cancelVisit(visitId);
      // After successful deletion, refetch the patients
      fetchVisits(currentPage, filter);
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
          <h2>Visits List</h2>
        </div>

        <Row>
          <Col md={6} className="mb-2 md-mb-0">
            <PatientSearchFilter onFilterChange={handleFilterChange} />
          </Col>

          <Col md={6} className="d-flex justify-content-end">
            <Link to={"/add-visit-with-no-params"}>
              <FaPlus /> Book New Visit
            </Link>
          </Col>
        </Row>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead>
              <tr className="text-center">
                <th>ID</th>
                <th>PatientId</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>visit Date</th>
                <th>Height</th>
                <th>Weight</th>
                <th>Bmi</th>
                <th>General Health</th>
                <th>Weight loss</th>
                <th>Use of Drugs</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(visits) &&
                visits.map((visit) => (
                  <tr key={visit.id} className="text-center">
                    <td>{visit.id}</td>
                    <td>{visit.patient.id}</td>
                    <td>{visit.patient.firstName}</td>
                    <td>{visit.patient.lastName}</td>
                    <td>{visit.visitDate}</td>
                    <td>{visit.height}</td>
                    <td>{visit.weight}</td>
                    <td>{visit.bmi}</td>
                    <td>{visit.generalHealth}</td>
                    <td>{visit.weightLoose}</td>
                    <td>{visit.onDrugs}</td>
                    <td>{visit.comments}</td>
                    <td className="gap-2">
                      <Link
                        to={`/edit-visit/${visit.id}/${visit.patient.id}`}
                        className="gap-2"
                      >
                        <span className="btn btn-info btn-sm">
                          <FaEye />
                        </span>
                        <span className="btn btn-warning btn-sm ml-5">
                          <FaEdit />
                        </span>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm ml-5"
                        onClick={() => handleDeleteVisit(visit.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <PatientPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePaginationChange}
        />
      </section>
    </>
  );
};

export default PatientsVisitsListView;
