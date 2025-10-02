import axios from "axios";

export const API_URL = "https://progress-tracker-typescript.onrender.com/api";

export const api = axios.create({
    baseURL: API_URL, 
    headers: {
        "Content-Type": "application/json"
    }
});