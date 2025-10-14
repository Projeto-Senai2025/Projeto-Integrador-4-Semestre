import api from './api';
import { Alerta, AlertaNivel } from '@/types';

export const alertsService = {
  async getAtivos(): Promise<Alerta[]> {
    const response = await api.get<Alerta[]>('/alertas/ativos');
    return response.data;
  },

  async getByNivel(nivel: AlertaNivel): Promise<Alerta[]> {
    const response = await api.get<Alerta[]>(`/alertas/nivel/${nivel}`);
    return response.data;
  },

  async getById(id: number): Promise<Alerta> {
    const response = await api.get<Alerta>(`/alertas/${id}`);
    return response.data;
  },
};
