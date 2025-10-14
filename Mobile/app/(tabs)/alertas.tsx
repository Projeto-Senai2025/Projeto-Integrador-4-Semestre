import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { ListFilter as Filter } from 'lucide-react-native';
import { alertsService } from '@/services/alerts';
import { Alerta, AlertaNivel } from '@/types';
import AlertaCard from '@/components/AlertaCard';

export default function Alertas() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filtroNivel, setFiltroNivel] = useState<AlertaNivel | 'TODOS'>('TODOS');

  const loadAlertas = async () => {
    try {
      setError('');
      const data = await alertsService.getAtivos();
      setAlertas(data.sort((a, b) =>
        new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
      ));
    } catch (err: any) {
      setError('Erro ao carregar alertas');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAlertas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAlertas();
  };

  const handleAlertaPress = (alerta: Alerta) => {
    Alert.alert(
      alerta.tipo,
      `${alerta.mensagem}\n\nNível: ${alerta.nivel}\nData: ${new Date(alerta.dataHora).toLocaleString('pt-BR')}`
    );
  };

  const handleFilter = () => {
    Alert.alert(
      'Filtrar por Nível',
      'Escolha o nível de alerta',
      [
        { text: 'Todos', onPress: () => setFiltroNivel('TODOS') },
        { text: 'Crítico', onPress: () => setFiltroNivel('CRITICAL') },
        { text: 'Aviso', onPress: () => setFiltroNivel('WARNING') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const alertasFiltrados =
    filtroNivel === 'TODOS'
      ? alertas
      : alertas.filter((a) => a.nivel === filtroNivel);

  const criticos = alertas.filter((a) => a.nivel === 'CRITICAL').length;
  const warnings = alertas.filter((a) => a.nivel === 'WARNING').length;

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
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{criticos}</Text>
            <Text style={styles.statLabel}>Críticos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{warnings}</Text>
            <Text style={styles.statLabel}>Avisos</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <Filter size={20} color="#0066cc" />
          <Text style={styles.filterText}>
            {filtroNivel === 'TODOS' ? 'Filtrar' : filtroNivel}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alertasFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AlertaCard alerta={item} onPress={() => handleAlertaPress(item)} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum alerta ativo</Text>
          </View>
        }
      />
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
  stats: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
});
