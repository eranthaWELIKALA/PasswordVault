import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://192.168.8.173:4000/api', // Change this when testing on a real device
});

api.interceptors.request.use(async (config) => {
    console.log("+++")
    let token;
    if (Platform.OS === 'web') {
        token = await AsyncStorage.getItem('userToken');
    } else {
        token = await SecureStore.getItemAsync('userToken');
    }
    console.log("****")
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
