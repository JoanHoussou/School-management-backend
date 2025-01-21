import axiosInstance from './axiosConfig';


// Services pour les matières
const getAllSubjects = async () => {
  try {
    const response = await axiosInstance.get('/subjects');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const createSubject = async (subjectData) => {
  try {
    const response = await axiosInstance.post('/subjects', subjectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const updateSubject = async (id, subjectData) => {
  try {
    const response = await axiosInstance.put(`/subjects/${id}`, subjectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Services pour le programme scolaire
const getCurriculum = async (filters = {}) => {
  try {
    const response = await axiosInstance.get('/curriculum', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const createCurriculum = async (curriculumData) => {
  try {
    const response = await axiosInstance.post('/curriculum', curriculumData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const updateCurriculum = async (id, curriculumData) => {
  try {
    const response = await axiosInstance.put(`/curriculum/${id}`, curriculumData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const deleteSubject = async (id) => {
  try {
    const response = await axiosInstance.delete(`/subjects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const deleteCurriculum = async (id) => {
  try {
    const response = await axiosInstance.delete(`/curriculum/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getCurriculum,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum
};