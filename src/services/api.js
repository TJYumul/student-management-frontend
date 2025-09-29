import axios from 'axios';

// Axios instance configured with your backend base URL
const api = axios.create({
	baseURL: 'http://127.0.0.1:8000/api',
	headers: { 'Content-Type': 'application/json' }
});

// Student CRUD operations
export const getStudents = () => api.get('/students');
export const getStudent = (id) => api.get(`/students/${id}`); // GET one
export const createStudent = (student) => api.post('/students', student); // POST create
export const updateStudent = (id, student) => api.put(`/students/${id}`, student); // PUT update
export const deleteStudent = (id) => api.delete(`/students/${id}`); // DELETE

export default api;
