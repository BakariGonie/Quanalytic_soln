import React from 'react';
import { Button } from 'react-bootstrap';

const PatientPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePaginationClick = (newPage) => {
    onPageChange(newPage); // Notify the parent component about the page change
  };

  return (
    <div className="d-flex justify-content-center mt-3">
      <Button
        variant="outline-secondary"
        disabled={currentPage === 1}
        onClick={() => handlePaginationClick(currentPage - 1)}
      >
        Previous
      </Button>
      <span className="mx-2">{`Page ${currentPage} of ${totalPages}`}</span>
      <Button
        variant="outline-secondary"
        disabled={currentPage === totalPages}
        onClick={() => handlePaginationClick(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};

export default PatientPagination;