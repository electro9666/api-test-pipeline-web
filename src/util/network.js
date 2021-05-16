import axios from 'axios';

export const makeInstance = () => { 
  return axios.create({
    timeout: 5000,
    baseURL: 'http://localhost:8080',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}