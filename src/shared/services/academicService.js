import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Services pour les matières
const getAllSubjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/subjects`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const createSubject = async (subjectData) => {
  try {
    const response = await axios.post(`${API_URL}/subjects`, subjectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const updateSubject = async (id, subjectData) => {
  try {
    const response = await axios.put(`${API_URL}/subjects/${id}`, subjectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Services pour le programme scolaire
const getCurriculum = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/curriculum`, { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const createCurriculum = async (curriculumData) => {
  try {
    const response = await axios.post(`${API_URL}/curriculum`, curriculumData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const updateCurriculum = async (id, curriculumData) => {
  try {
    const response = await axios.put(`${API_URL}/curriculum/${id}`, curriculumData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getAllSubjects,
  createSubject,
  updateSubject,
  getCurriculum,
  createCurriculum,
  updateCurriculum
};