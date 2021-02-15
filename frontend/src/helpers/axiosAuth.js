import axios from 'axios';
import { endpoints } from '../config.js';

const axiosInstance = axios.create({
  baseURL: endpoints.auth,
});

export default axiosInstance;
