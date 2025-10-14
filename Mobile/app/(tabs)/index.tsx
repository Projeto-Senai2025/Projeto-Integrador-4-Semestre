import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, TriangleAlert as AlertTriangle, ChartBar as BarChart3, LogOut } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { sensorsService } from '@/services/sensors';
import { alertsService } from '@/services/alerts';
import { Sensor, Alerta } from '@/types';
import DashboardCard from '@/components/DashboardCard';

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setError('');
      const [sensoresData, alertasData] = await Promise.all([
        sensorsService.getAll(),
        alertsService.getAtivos(),
      ]);
      setSensores(sensoresData);
      setAlertas(alertasData);
    } catch (err: any) {
      setError('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const alertasCriticos = alertas.filter((a) => a.nivel === 'CRITICAL').length;
  const alertasWarning = alertas.filter((a) => a.nivel === 'WARNING').length;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.nome}!</Text>
          <Text style={styles.role}>{user?.role}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.cards}>
        <DashboardCard
          title="Sensores Ativos"
          value={sensores.length}
          icon={Activity}
          color="#0066cc"
          onPress={() => router.push('/(tabs)/sensores')}
        />

        <DashboardCard
          title="Alertas Críticos"
          value={alertasCriticos}
          icon={AlertTriangle}
          color="#dc2626"
          onPress={() => router.push('/(tabs)/alertas')}
        />

        <DashboardCard
          title="Avisos"
          value={alertasWarning}
          icon={AlertTriangle}
          color="#f59e0b"
          onPress={() => router.push('/(tabs)/alertas')}
        />

        <DashboardCard
          title="Leituras Hoje"
          value="-"
          icon={BarChart3}
          color="#10b981"
          onPress={() => router.push('/(tabs)/leituras')}
        />
      </View>

      {alertas.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas Recentes</Text>
          {alertas.slice(0, 5).map((alerta) => (
            <View
              key={alerta.id}
              style={[
                styles.alertCard,
                {
                  borderLeftColor: alerta.nivel === 'CRITICAL' ? '#dc2626' : '#f59e0b',
                },
              ]}>
              <Text style={styles.alertType}>{alerta.tipo}</Text>
              <Text style={styles.alertMessage}>{alerta.mensagem}</Text>
              <Text style={styles.alertDate}>
                {new Date(alerta.dataHora).toLocaleString('pt-BR')}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#fee',
    margin: 16,
    borderRadius: 8,
  },
  cards: {
    padding: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  alertType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  alertDate: {
    fontSize: 12,
    color: '#999',
  },
});
