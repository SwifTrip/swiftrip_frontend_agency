import axios from "axios";

axios.defaults.withCredentials = true;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function registerUser(formData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, formData, {
            headers: { "Content-Type" : "application/json" }
        });
        return response.data;
    } catch (err) {
        throw err.response?.data || {message : "Registration Failed"};
    }
}

export async function loginUser(formData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, formData);
        return response.data;
    } catch (err) {
        throw err.response?.data || {message : "Login Failed"};
    }
}
