import axios from 'axios';
// Tạo một instance của axios với cấu hình mặc định
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
const instance = axios.create({
    baseURL: baseURL,
    timeout: 1000,
});

export default instance;
