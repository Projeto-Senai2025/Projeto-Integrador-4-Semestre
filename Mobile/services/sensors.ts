import api from './api';
import { Sensor, CreateSensorRequest } from '@/types';

export const sensorsService = {
  async getAll(): Promise<Sensor[]> {
    const response = await api.get<Sensor[]>('/sensores');
    return response.data;
  },

  async getById(id: number): Promise<Sensor> {
    const response = await api.get<Sensor>(`/sensores/${id}`);
    return response.data;
  },

  async create(sensor: CreateSensorRequest): Promise<Sensor> {
    const response = await api.post<Sensor>('/sensores', sensor);
    return response.data;
  },

  async update(id: number, sensor: Partial<CreateSensorRequest>): Promise<Sensor> {
    const response = await api.put<Sensor>(`/sensores/${id}`, sensor);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/sensores/${id}`);
  },
};
