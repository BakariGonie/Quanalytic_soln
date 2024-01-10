import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:9192",
});

export const getHeader = () => {
  return {
    "Content-Type": "application/json",
  };
};

/* This function adds a new Patient to the database */
export async function AddNewPatientApi(
  firstName,
  lastName,
  dob,
  gender,
  dateRegistered
) {
  const formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("dob", dob);
  formData.append("gender", gender);
  formData.append("dateRegistered", dateRegistered);
  const response = await api.post("/patients/new-patient", formData, {
    headers: getHeader(),
  });
  if (response.status === 201) {
    return true;
  } else {
    return false;
  }
}

/* This function gets all patient by first name from thee database */
export async function getPatientsByFirstName(firstName, page, size) {
  try {
    const params = {
      page: page - 1, // Adjust the page number
      size,
      search: firstName,
    };
    const result = await api.get(
      `/patients/first-name-with-params/${firstName}`,
      { params }
    );
    return result.data;
  } catch (error) {
    throw new Error("Error fetching patients");
  }
}
// This function gets all patients from the database with pagination
export async function getAllPatients(page, size, searchQuery = "") {
  try {
    const params = {
      page: page - 1, //Adjust the page number
      size,
      search: searchQuery,
    };
    const result = await api.get("/patients/all-patients-with-params", {
      params,
    });
    return result.data;
  } catch (error) {
    throw new Error("Error fetching patients");
  }
}

/* This function deletes a Patient by the Id */
export async function deletePatient(id) {
  try {
    const result = await api.delete(`/patients/delete/${id}`, {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error deleting room ${error.message}`);
  }
}
/* This function update a patient */
export async function updatePatient(patientId, patientData) {
  const formData = new FormData();
  formData.append("firstName", patientData.firstName);
  formData.append("lastName", patientData.lastName);
  formData.append("dob", patientData.dob);
  formData.append("gender", patientData.gender);
  formData.append("dateRegistered", patientData.dateRegistered);
  const response = await api.put(`/patients/update/${patientId}`, formData, {
    headers: getHeader(),
  });
  return response;
}

/* This funcction gets a patient by the id */
export async function getPatientById(patientId) {
  try {
    const result = await api.get(`/patients/patient/${patientId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching patient ${error.message}`);
  }
}

/* This function saves a new visit to the database */
export async function AddNewVisitApi(patientId, visits) {
  try {
    const response = await api.post(`/visits/${patientId}/add/visit`, visits);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error adding visit : ${error.message}`);
    }
  }
}

/* This function updates a visit in the database */
export async function updateVisit(visitId, patientId, visits) {
  try {
    const response = await api.put(
      `/visits/update/${visitId}/patient/${patientId}`,
      visits
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error updating visit: ${error.message}`);
    }
  }
}

/*The function to display patient fullname */
export async function SearchAndDisplayPatientsApi(query) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const result = await api.get(
      `/patients/patient-fullnames?query=${encodedQuery}`,
      {
        headers: getHeader(),
      }
    );
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching visits: ${error.message}`);
  }
}

/* This function gets all visits from the database */
export async function getAllVisits(page, size, searchQuery = "") {
  try {
    const params = {
      page: page - 1, //Adjust the page number
      size,
      search: searchQuery,
    };
    const result = await api.get(
      "/visits/all-visits-with-params",
      { params },
      {
        headers: getHeader(),
      }
    );
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching visits : ${error.message}`);
  }
}

/* This funcction gets a visit by patient id */
export async function getVisitByPatientId(
  patientId,
  page,
  size,
  searchQuery = ""
) {
  try {
    const params = {
      page: page - 1, //Adjust the page number
      size,
      search: searchQuery,
    };
    const result = await api.get(`/visits/${patientId}/visits-with-params`, {
      params,
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching visits ${error.message}`);
  }
}

/* This funcction gets a visits by first name */
export async function getPatientVisitsByFirstName(
  firstName,
  page,
  size,
  searchQuery = ""
) {
  try {
    const params = {
      page: page - 1, //Adjust the page number
      size,
      search: searchQuery,
    };
    const result = await api.get(
      `/visits/first-name/${firstName}/visits-with-params`,
      { params }
    );
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching visits ${error.message}`);
  }
}

/* This funcction gets a visit by the id */
export async function getVisitById(visitId) {
  try {
    const result = await api.get(`/visits/visit/${visitId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching patient ${error.message}`);
  }
}

/* This function gets a visit by the visitDate */
export async function getVisitByVisitDate(visitDate) {
  try {
    const result = await api.get(`/visits/report/${visitDate}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching patient ${error.message}`);
  }
}

/* This is the function to cancel patient visit */
export async function cancelVisit(visitId) {
  try {
    const result = await api.delete(`/visits/delete/${visitId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error cancelling visit :${error.message}`);
  }
}

export const calculateBMI = async (weight, height) => {
  try {
    const response = await api.get("/calculate-bmi", {
      params: { weight, height },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to calculate BMI");
  }
};
