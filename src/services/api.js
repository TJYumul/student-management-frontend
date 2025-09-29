import axios from 'axios';

const api = axios.create({
	baseURL: 'http://127.0.0.1:8000/api',
	headers: { 'Content-Type': 'application/json' }
});

export const getStudents = () => api.get('/students');
export const getStudent = (id) => api.get(`/students/${id}`); 
export const createStudent = (student) => api.post('/students', student); 
export const updateStudent = (id, student) => api.put(`/students/${id}`, student); 
export const deleteStudent = (id) => api.delete(`/students/${id}`);

export default api;
