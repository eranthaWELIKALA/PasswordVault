import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Device from "expo-device";
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const deviceId =
    Device.osInternalBuildId ||
    Device.osBuildId ||
    Device.modelId ||
    "unknown";

const api = axios.create({
    baseURL: 'http://127.0.0.1:4000/api',
});

api.interceptors.request.use(async (config) => {
    let token;
    if (Platform.OS === 'web') {
        token = await AsyncStorage.getItem('userToken');
    } else {
        token = await SecureStore.getItemAsync('userToken');
    }
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['device-id'] = deviceId;
    return config;
});

export default api;
