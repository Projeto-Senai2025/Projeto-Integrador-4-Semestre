import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Activity } from 'lucide-react-native';
import { Sensor } from '@/types';

interface SensorCardProps {
  sensor: Sensor;
  onPress?: () => void;
}

const sensorTypeColors: Record<string, string> = {
  TEMPERATURA_AR: '#f59e0b',
  UMIDADE_AR: '#3b82f6',
  PRESSAO: '#8b5cf6',
  UMIDADE_SOLO: '#0ea5e9',
  PH_SOLO: '#14b8a6',
  NUTRIENTES: '#10b981',
  LUMINOSIDADE: '#fbbf24',
  INDICE_UV: '#f97316',
  CHUVA: '#06b6d4',
};

export default function SensorCard({ sensor, onPress }: SensorCardProps) {
  const color = sensorTypeColors[sensor.tipo] || '#0066cc';

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Activity size={28} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.tipo}>{sensor.tipo.replace(/_/g, ' ')}</Text>
        <Text style={styles.localizacao}>{sensor.localizacao}</Text>
        <Text style={styles.descricao}>{sensor.descricao}</Text>
        <View style={styles.limites}>
          <Text style={styles.limiteText}>
            Min: {sensor.limiteMin} | Max: {sensor.limiteMax}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  tipo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  localizacao: {
    fontSize: 14,
    color: '#0066cc',
    marginBottom: 4,
  },
  descricao: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  limites: {
    flexDirection: 'row',
  },
  limiteText: {
    fontSize: 12,
    color: '#999',
  },
});
