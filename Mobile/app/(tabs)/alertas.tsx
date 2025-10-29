import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert as RNAlert,
  TouchableOpacity,
} from 'react-native';
import { ListFilter as Filter } from 'lucide-react-native';
import { alertsService } from '@/services/alerts';
import { Alerta, SensorTipo } from '@/types';
import AlertaCard from '@/components/AlertaCard';
import FiltroAlertas, { FiltroValores } from '@/components/FiltroAlertas';

export default function Alertas() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>('');

  // Modal de filtro (com calendário)
  const [filtroOpen, setFiltroOpen] = useState(false);
  const [filtro, setFiltro] = useState<FiltroValores>({
    tipos: ['TEMPERATURA_AR', 'UMIDADE_AR', 'UMIDADE_SOLO'],
    de: null,
    ate: null,
  });

  const loadAlertas = async () => {
    try {
      setError('');
      const data = await alertsService.getAtivos();
      setAlertas(
        (data ?? []).sort(
          (a, b) =>
            new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
        )
      );
    } catch {
      setError('Erro ao carregar alertas');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAlertas();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAlertas();
  }, []);

  // ---- Filtro local (tipos + período De/Até)
  const filtrados = useMemo(() => {
    const from =
      filtro.de != null
        ? new Date(
            filtro.de.getFullYear(),
            filtro.de.getMonth(),
            filtro.de.getDate(),
            0, 0, 0, 0
          ).getTime()
        : -Infinity;

    const to =
      filtro.ate != null
        ? new Date(
            filtro.ate.getFullYear(),
            filtro.ate.getMonth(),
            filtro.ate.getDate(),
            23, 59, 59, 999
          ).getTime()
        : Infinity;

    return (alertas ?? []).filter((a) => {
      const tipoOk =
        filtro.tipos.length === 0
          ? true
          : filtro.tipos.includes(a.tipo as SensorTipo);

      const createdAt = a.dataHora ? new Date(a.dataHora).getTime() : 0;
      const periodoOk = createdAt >= from && createdAt <= to;

      return tipoOk && periodoOk;
    });
  }, [alertas, filtro]);

  // Contadores com base no que está sendo exibido (após filtro)
  const criticos = filtrados.filter((a) => a.nivel === 'CRITICAL').length;
  const warnings = filtrados.filter((a) => a.nivel === 'WARNING').length;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  const handleAlertaPress = (alerta: Alerta) => {
    RNAlert.alert(
      alerta.tipo,
      `${alerta.mensagem}\n\nNível: ${alerta.nivel}\nData: ${new Date(
        alerta.dataHora
      ).toLocaleString('pt-BR')}`
    );
  };

  return (
    <View style={styles.container}>
      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.toolbar}>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#dc2626' }]}>{criticos}</Text>
            <Text style={styles.statLabel}>Críticos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#f59e0b' }]}>{warnings}</Text>
            <Text style={styles.statLabel}>Avisos</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFiltroOpen(true)}
          activeOpacity={0.8}
        >
          <Filter size={20} color="#2563eb" />
          <Text style={styles.filterText}>Filtrar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AlertaCard alerta={item} onPress={() => handleAlertaPress(item)} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum alerta ativo</Text>
          </View>
        }
      />

      <FiltroAlertas
        visible={filtroOpen}
        valores={filtro}
        onClose={() => setFiltroOpen(false)}
        onApply={(f) => {
          setFiltro(f);
          setFiltroOpen(false);
        }}
        onClear={() => {
          const reset = {
            tipos: ['TEMPERATURA_AR', 'UMIDADE_AR', 'UMIDADE_SOLO'] as SensorTipo[],
            de: null,
            ate: null,
          };
          setFiltro(reset);
          setFiltroOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#fee2e2',
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
  stats: { flexDirection: 'row', gap: 24 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  filterButton: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: '#eef2ff', borderRadius: 10 },
  filterText: { fontSize: 14, color: '#2563eb', marginLeft: 6, fontWeight: '700' },
  list: { padding: 16 },
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },
});
