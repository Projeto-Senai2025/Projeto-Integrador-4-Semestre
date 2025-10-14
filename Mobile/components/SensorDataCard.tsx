import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { SensorData } from '@/types';

interface SensorDataCardProps {
  data: SensorData;
}

export default function SensorDataCard({ data }: SensorDataCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <TrendingUp size={24} color="#0066cc" />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.valor}>{data.valor.toFixed(2)}</Text>
          <Text style={styles.sensorId}>Sensor #{data.sensorId}</Text>
        </View>
        <Text style={styles.dataHora}>
          {new Date(data.dataHora).toLocaleString('pt-BR')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderLeftWidth: 3,
    borderLeftColor: '#0066cc',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  valor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  sensorId: {
    fontSize: 12,
    color: '#999',
  },
  dataHora: {
    fontSize: 13,
    color: '#666',
  },
});
