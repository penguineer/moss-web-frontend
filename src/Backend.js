// Backend.js
import axios from 'axios';

const backendAxios = axios.create({
  baseURL: "/backend",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default backendAxios;