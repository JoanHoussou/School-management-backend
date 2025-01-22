import axiosInstance from './axiosConfig';


// Services pour les matières
const getAllSubjects = async () => {
  try {
    const response = await axiosInstance.get('/academic/subjects');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const createSubject = async (subjectData) => {
  try {
    const response = await axiosInstance.post('/academic/subjects', subjectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const updateSubject = async (id, subjectData) => {
  try {
    const response = await axiosInstance.put(`/academic/subjects/${id}`, subjectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Services pour le programme scolaire
const getCurriculum = async (filters = {}) => {
  try {
    const response = await axiosInstance.get('/academic/curriculum', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const createCurriculum = async (curriculumData) => {
  try {
    const response = await axiosInstance.post('/academic/curriculum', curriculumData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const updateCurriculum = async (id, curriculumData) => {
  try {
    const response = await axiosInstance.put(`/academic/curriculum/${id}`, curriculumData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const deleteSubject = async (id) => {
  try {
    const response = await axiosInstance.delete(`/academic/subjects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const deleteCurriculum = async (id) => {
  try {
    const response = await axiosInstance.delete(`/academic/curriculum/${id}`);
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