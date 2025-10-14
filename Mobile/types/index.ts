export type UserRole = 'ADMIN' | 'AGRICULTOR';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
}

export type SensorTipo =
  | 'TEMPERATURA_AR'
  | 'UMIDADE_AR'
  | 'PRESSAO'
  | 'UMIDADE_SOLO'
  | 'PH_SOLO'
  | 'NUTRIENTES'
  | 'LUMINOSIDADE'
  | 'INDICE_UV'
  | 'CHUVA';

export interface Sensor {
  id: number;
  tipo: SensorTipo;
  localizacao: string;
  descricao: string;
  limiteMin: number;
  limiteMax: number;
}

export interface SensorData {
  id: number;
  valor: number;
  dataHora: string;
  sensorId: number;
}

export type AlertaNivel = 'WARNING' | 'CRITICAL';

export interface Alerta {
  id: number;
  tipo: string;
  mensagem: string;
  nivel: AlertaNivel;
  dataHora: string;
  sensorDataId: number;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface CreateSensorRequest {
  tipo: SensorTipo;
  localizacao: string;
  descricao: string;
  limiteMin: number;
  limiteMax: number;
}

export interface CreateSensorDataRequest {
  valor: number;
  sensorId: number;
}
