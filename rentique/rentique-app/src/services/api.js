import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust if backend runs on different port
});

// Add a request interceptor to include token if available
API.interceptors.request.use((req) => {
    if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.token) {
            req.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return req;
});

export default API;
