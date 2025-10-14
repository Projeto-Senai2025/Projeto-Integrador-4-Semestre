import api from './api';
import { SensorData, CreateSensorDataRequest } from '@/types';

export const sensorDataService = {
  async getAll(): Promise<SensorData[]> {
    const response = await api.get<SensorData[]>('/dados');
    return response.data;
  },

  async getBySensor(
    sensorId: number,
    inicio?: string,
    fim?: string
  ): Promise<SensorData[]> {
    let url = `/dados/sensor/${sensorId}`;
    const params = new URLSearchParams();

    if (inicio) params.append('inicio', inicio);
    if (fim) params.append('fim', fim);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get<SensorData[]>(url);
    return response.data;
  },

  async create(data: CreateSensorDataRequest): Promise<SensorData> {
    const response = await api.post<SensorData>('/dados', data);
    return response.data;
  },
};
