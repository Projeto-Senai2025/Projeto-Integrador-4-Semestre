// app/(tabs)/Sensores.tsx
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
  Modal,
  TextInput,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { sensorsService } from '@/services/sensors';
import { Sensor } from '@/types';
import { useAuthStore } from '@/store/authStore';
import SensorCard from '@/components/SensorCard';

type TipoSensor = 'TEMPERATURA_AR' | 'UMIDADE_AR' | 'UMIDADE_SOLO';

export default function Sensores() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // estado do modal de adicionar
  const [addOpen, setAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // campos do formulário
  const [tipo, setTipo] = useState<TipoSensor>('TEMPERATURA_AR');
  const [localizacao, setLocalizacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [limiteMin, setLimiteMin] = useState<string>('');
  const [limiteMax, setLimiteMax] = useState<string>('');

  const resetForm = () => {
    setTipo('TEMPERATURA_AR');
    setLocalizacao('');
    setDescricao('');
    setLimiteMin('');
    setLimiteMax('');
  };

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
    setAddOpen(true);
  };

  const validate = () => {
    if (!localizacao.trim()) return 'Informe a localização.';
    if (!descricao.trim()) return 'Informe a descrição.';
    if (limiteMin.trim() === '' || limiteMax.trim() === '') {
      return 'Informe os limites mínimo e máximo.';
    }
    const min = Number(limiteMin);
    const max = Number(limiteMax);
    if (Number.isNaN(min) || Number.isNaN(max)) {
      return 'Limites precisam ser números.';
    }
    if (max <= min) {
      return 'O limite máximo deve ser maior que o mínimo.';
    }
    return '';
  };

  const submitNewSensor = async () => {
    const v = validate();
    if (v) {
      Alert.alert('Validação', v);
      return;
    }
    try {
      setSubmitting(true);
      // Monta o payload esperado pela API (CreateSensorRequest)
      const payload = {
        tipo,
        localizacao: localizacao.trim(),
        descricao: descricao.trim(),
        limiteMin: Number(limiteMin),
        limiteMax: Number(limiteMax),
      };
      const created = await sensorsService.create(payload as any);
      // Estratégia: inserir no topo para o usuário ver imediatamente
      setSensores((prev) => [created, ...prev]);
      setAddOpen(false);
      resetForm();
      Alert.alert('Sucesso', 'Sensor cadastrado com sucesso.');
    } catch (err: any) {
      Alert.alert('Erro', 'Falha ao cadastrar sensor.');
    } finally {
      setSubmitting(false);
    }
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

      {/* Modal de adicionar sensor */}
      <Modal
        visible={addOpen}
        animationType="slide"
        transparent
        onRequestClose={() => !submitting && setAddOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Adicionar Sensor</Text>

            <Text style={styles.label}>Tipo</Text>
            <View style={styles.typeRow}>
              {(['TEMPERATURA_AR', 'UMIDADE_AR', 'UMIDADE_SOLO'] as TipoSensor[]).map(
                (t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeChip, tipo === t && styles.typeChipActive]}
                    onPress={() => setTipo(t)}
                    disabled={submitting}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        tipo === t && styles.typeChipTextActive,
                      ]}
                    >
                      {t.replace(/_/g, ' ')}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <Text style={styles.label}>Localização</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Estufa 1 - Corredor A"
              value={localizacao}
              onChangeText={setLocalizacao}
              editable={!submitting}
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Breve descrição"
              value={descricao}
              onChangeText={setDescricao}
              editable={!submitting}
              multiline
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Mínimo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: 18"
                  keyboardType="numeric"
                  value={limiteMin}
                  onChangeText={setLimiteMin}
                  editable={!submitting}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Máximo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: 28"
                  keyboardType="numeric"
                  value={limiteMax}
                  onChangeText={setLimiteMax}
                  editable={!submitting}
                />
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.button, styles.btnGhost]}
                onPress={() => {
                  if (!submitting) {
                    setAddOpen(false);
                    resetForm();
                  }
                }}
                disabled={submitting}
              >
                <Text style={[styles.buttonText, styles.btnGhostText]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.btnPrimary]}
                onPress={submitNewSensor}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#fee',
    margin: 16,
    borderRadius: 8,
  },
  list: { padding: 16 },
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },

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

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  label: { fontSize: 12, color: '#555', marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111',
  },
  row: { flexDirection: 'row' },

  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  typeChipActive: {
    backgroundColor: '#e6f0ff',
    borderColor: '#0066cc',
  },
  typeChipText: { fontSize: 12, color: '#334155' },
  typeChipTextActive: { color: '#0b4fb3', fontWeight: '600' },

  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 12 },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnPrimary: { backgroundColor: '#0066cc' },
  btnGhost: { backgroundColor: '#f3f4f6' },
  buttonText: { color: '#fff', fontWeight: '600' },
  btnGhostText: { color: '#111' },
});
