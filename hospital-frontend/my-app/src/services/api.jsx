import axios from "axios";

const API_URL = "http://localhost:5096/api/patient";


export const getPatients = async () => {
  return await axios.get(API_URL);

};

export const getPatientById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
}

export const createPatient = async (data) => {
  return await axios.post(API_URL, data);
};

export const deletePatient = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};


export const updatePatient = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`,data);
};
