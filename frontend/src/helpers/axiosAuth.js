import axios from 'axios';
import { endpoints } from '../config.json';

const axiosInstance = axios.create({
  baseURL: endpoints.auth,
});

export default axiosInstance;
