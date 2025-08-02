import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Make sure this is set correctly in .env
  withCredentials: true,
});

export default instance;
