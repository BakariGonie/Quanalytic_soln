import React, { useEffect, useState } from "react";

const VisitDetailsForm = ({ onDetailsChange, resetDetails, bmiCategory }) => {
  const [details, setDetails] = useState({
    generalHealth: "",
    weightLoose: "",
    onDrugs: "",
    comments: "",
  });

  const handleInputChange = (name, value) => {
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    onDetailsChange(details); // Notify the parent component about the change
  };

  useEffect(() => {
    // Reset details when resetDetails prop changes
    if (resetDetails) {
      setDetails({
        generalHealth: "",
        weightLoose: "",
        onDrugs: "",
        comments: "",
      });
    }
  }, [resetDetails]);

  return (
    <div className="visit-details-form">
      <div className="mb-3">
        <label className="form-label">General Health</label>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            id="goodRadio"
            value="Good"
            checked={details.generalHealth === "Good"}
            onChange={() => handleInputChange("generalHealth", "Good")}
          />
          <label className="form-check-label" htmlFor="goodRadio">
            Good
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            id="poorRadio"
            value="Poor"
            checked={details.generalHealth === "Poor"}
            onChange={() => handleInputChange("generalHealth", "Poor")}
          />
          <label className="form-check-label" htmlFor="poorRadio">
            Poor
          </label>
        </div>
      </div>

      {bmiCategory === 0 && (
        <div className="mb-3">
          <label className="form-label">
            Have you ever been on a diet to lose weight?
          </label>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="yesWeightRadio"
              value="Yes"
              checked={details.weightLoose === "Yes"}
              onChange={() => handleInputChange("weightLoose", "Yes")}
            />
            <label className="form-check-label" htmlFor="yesWeightRadio">
              Yes
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="noWeightRadio"
              value="No"
              checked={details.weightLoose === "No"}
              onChange={() => handleInputChange("weightLoose", "No")}
            />
            <label className="form-check-label" htmlFor="noWeightRadio">
              No
            </label>
          </div>
        </div>
      )}

      {bmiCategory === 1 && (
        <div className="mb-3">
          <label className="form-label">
            Are you currently taking any drugs?
          </label>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="yesDrugsRadio"
              value="Yes"
              checked={details.onDrugs === "Yes"}
              onChange={() => handleInputChange("onDrugs", "Yes")}
            />
            <label className="form-check-label" htmlFor="yesDrugsRadio">
              Yes
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="noDrugsRadio"
              value="No"
              checked={details.onDrugs === "No"}
              onChange={() => handleInputChange("onDrugs", "No")}
            />
            <label className="form-check-label" htmlFor="noDrugsRadio">
              No
            </label>
          </div>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Comments</label>
        <textarea
          className="form-control"
          value={details.comments}
          onChange={(e) => handleInputChange("comments", e.target.value)}
        />
      </div>
    </div>
  );
};

export default VisitDetailsForm;
