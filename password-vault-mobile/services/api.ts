import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    baseURL: 'http://localhost:4000/api', // Change this when testing on a real device
});

api.interceptors.request.use(async (config) => {
    console.log("+++")
    const token = await SecureStore.getItemAsync('userToken');
    console.log("****")
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
