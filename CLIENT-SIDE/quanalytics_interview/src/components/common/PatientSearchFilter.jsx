import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const PatientSearchFilter = ({ onFilterChange }) => {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    onFilterChange(newFilter); // Notify the parent component about the filter change
  };

  return (
    <section className="container mt-5 mb-5">
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
    <div className="mb-3">
    <label htmlFor="filterInput" className="form-label">
      Search by Firstname:
    </label>
    <div className="input-group">
      <div className="input-group-prepend">
        <span
          className="input-group-text"
          id="searchIcon"
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            marginRight: "-1px", // Adjust the alignment
          }}
        >
          <FaSearch />
        </span>
      </div>
      <input
        type="text"
        className="form-control form-control-sm-2" // Apply form-control-sm class
        id="filterInput"
        placeholder="Enter firstname"
        value={filter}
        onChange={handleFilterChange}
        style={{
          marginLeft: "-1px", // Adjust the alignment
          paddingTop: "0.375rem", // Adjust the top padding
          paddingBottom: "0.375rem", // Adjust the bottom padding
        }}
      />
    </div>
  </div>
  </div>
  </div>
  </section>
  );
};

export default PatientSearchFilter;
