import axios from 'axios';
import { msalInstance } from './msalConfig'; 

const instance = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(async (config) => {
    const account = msalInstance.getAllAccounts()[0]; 
    if (account) {
      try {
        const tokenResponse = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTmdoaWEgTmd1eWVuIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJleHAiOjE3MjIxNzIxNDcsImlzcyI6Imh0dHBzOi8vd3d3LnNjaG9vbG91dGZpdHRlcnMuY29tLyIsImF1ZCI6Imh0dHBzOi8vd3d3LnNjaG9vbG91dGZpdHRlcnMuY29tLyJ9.YqQKRVfsjFEGDC86RnOdiRMsgkTMiXMBCIE68YStbFU';
        config.headers['Authorization'] = `Bearer ${tokenResponse}`;
      } catch (error) {
        console.error('Error acquiring token silently:', error);
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  
  export default instance;