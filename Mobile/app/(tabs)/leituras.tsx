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
import { Plus, ListFilter as Filter } from 'lucide-react-native';
import { sensorDataService } from '@/services/sensorData';
import { SensorData } from '@/types';
import { useAuthStore } from '@/store/authStore';
import SensorDataCard from '@/components/SensorDataCard';

export default function Leituras() {
  const { user } = useAuthStore();

  const [leituras, setLeituras] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadLeituras = async () => {
    try {
      setError('');
      const data = await sensorDataService.getAll();
      setLeituras(data.sort((a, b) =>
        new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
      ));
    } catch (err: any) {
      setError('Erro ao carregar leituras');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeituras();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadLeituras();
  };

  const handleAddLeitura = () => {
    Alert.alert('Em desenvolvimento', 'Funcionalidade de adicionar leitura em breve');
  };

  const handleFilter = () => {
    Alert.alert('Em desenvolvimento', 'Funcionalidade de filtrar leituras em breve');
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

      <View style={styles.toolbar}>
        <Text style={styles.totalText}>Total: {leituras.length} leituras</Text>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <Filter size={20} color="#0066cc" />
          <Text style={styles.filterText}>Filtrar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={leituras}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SensorDataCard data={item} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma leitura registrada</Text>
          </View>
        }
      />

      {user?.role === 'ADMIN' && (
        <TouchableOpacity style={styles.fab} onPress={handleAddLeitura}>
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
  toolbar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalText: {
    fontSize: 14,
    color: '#666',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#0066cc',
    marginLeft: 4,
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
