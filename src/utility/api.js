import axios from 'axios';

const API = axios.create({
  baseURL: 'https://blogify-zv8t.onrender.com/', // Replace with your backend URL
});

// Add token automatically if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
