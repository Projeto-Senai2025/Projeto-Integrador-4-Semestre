import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { sensorsService } from '@/services/sensors';
import { Sensor } from '@/types';
import { useAuthStore } from '@/store/authStore';
import SensorCard from '@/components/SensorCard';

export default function Sensores() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadSensores = async () => {
    try {
      setError('');
      const data = await sensorsService.getAll();
      setSensores(data);
    } catch (err: any) {
      setError('Erro ao carregar sensores');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSensores();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSensores();
  };

  const handleAddSensor = () => {
    Alert.alert('Em desenvolvimento', 'Funcionalidade de adicionar sensor em breve');
  };

  const handleSensorPress = (sensor: Sensor) => {
    Alert.alert(
      sensor.tipo.replace(/_/g, ' '),
      `Localização: ${sensor.localizacao}\nDescrição: ${sensor.descricao}\n\nLimites:\nMínimo: ${sensor.limiteMin}\nMáximo: ${sensor.limiteMax}`
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={sensores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SensorCard sensor={item} onPress={() => handleSensorPress(item)} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum sensor cadastrado</Text>
          </View>
        }
      />

      {user?.role === 'ADMIN' && (
        <TouchableOpacity style={styles.fab} onPress={handleAddSensor}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#fee',
    margin: 16,
    borderRadius: 8,
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
