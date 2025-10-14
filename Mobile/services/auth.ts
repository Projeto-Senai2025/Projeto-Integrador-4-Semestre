import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { LoginRequest, LoginResponse, Usuario } from '@/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const { token, usuario } = response.data;

    await AsyncStorage.setItem('jwt_token', token);
    await AsyncStorage.setItem('user_data', JSON.stringify(usuario));

    return response.data;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('jwt_token');
    await AsyncStorage.removeItem('user_data');
  },

  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem('jwt_token');
  },

  async getStoredUser(): Promise<Usuario | null> {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getStoredToken();
    return !!token;
  },
};
