import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SensorTipo } from '@/types';

export interface FiltroValores {
  tipos: SensorTipo[];
  de: Date | null;
  ate: Date | null;
}

interface Props {
  visible: boolean;
  valores: FiltroValores;
  onClose: () => void;
  onApply: (f: FiltroValores) => void;
  onClear: () => void;
}

const TIPOS: SensorTipo[] = ['TEMPERATURA_AR', 'UMIDADE_AR', 'UMIDADE_SOLO'];

export default function FiltroAlertas({ visible, valores, onClose, onApply, onClear }: Props) {
  const [tipos, setTipos] = useState<SensorTipo[]>(valores.tipos);
  const [de, setDe] = useState<Date | null>(valores.de);
  const [ate, setAte] = useState<Date | null>(valores.ate);

  const toggleTipo = (t: SensorTipo) => {
    setTipos(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const aplicar = () => onApply({ tipos, de, ate });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Filtrar alertas</Text>

          <Text style={styles.section}>Tipos de sensor</Text>
          <View style={styles.tags}>
            {TIPOS.map(t => (
              <Pressable
                key={t}
                onPress={() => toggleTipo(t)}
                style={[styles.tag, tipos.includes(t) && styles.tagActive]}
              >
                <Text style={[styles.tagText, tipos.includes(t) && styles.tagTextActive]}>
                  {mapTipo(t)}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.section}>Período</Text>
          <DateField label="De" value={de} onChange={setDe} />
          <DateField label="Até" value={ate} onChange={setAte} />

          <View style={styles.actions}>
            <Pressable onPress={onClear} style={[styles.btn, styles.btnGhost]}>
              <Text style={[styles.btnText, styles.btnGhostText]}>Limpar</Text>
            </Pressable>
            <Pressable onPress={onClose} style={[styles.btn, styles.btnLight]}>
              <Text style={styles.btnText}>Cancelar</Text>
            </Pressable>
            <Pressable onPress={aplicar} style={[styles.btn, styles.btnPrimary]}>
              <Text style={[styles.btnText, { color: '#fff' }]}>Aplicar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function DateField({
  label, value, onChange,
}: { label: string; value: Date | null; onChange: (d: Date | null) => void }) {
  const [show, setShow] = useState(false);
  return (
    <View style={{ marginTop: 8 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable onPress={() => setShow(true)} style={styles.dateInput}>
        <Text style={styles.dateText}>{value ? brDate(value) : 'Selecionar data'}</Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"               // <-- CALENDÁRIO
          display="default"
          onChange={(_, d) => {
            if (Platform.OS !== 'ios') setShow(false);
            if (d) onChange(d);
          }}
        />
      )}
      {value && (
        <Pressable onPress={() => onChange(null)} style={styles.clearDate}>
          <Text style={styles.clearDateText}>Limpar {label.toLowerCase()}</Text>
        </Pressable>
      )}
    </View>
  );
}

function mapTipo(t: SensorTipo) {
  switch (t) {
    case 'TEMPERATURA_AR': return 'Temperatura do ar';
    case 'UMIDADE_AR':     return 'Umidade do ar';
    case 'UMIDADE_SOLO':   return 'Umidade do solo';
    default:               return t;
  }
}

const brDate = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#0006', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  title: { fontSize: 18, fontWeight: '700' },
  section: { marginTop: 12, fontWeight: '600', color: '#333' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  tag: { borderWidth: 1, borderColor: '#ddd', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  tagActive: { backgroundColor: '#eef2ff', borderColor: '#6366f1' },
  tagText: { color: '#555' },
  tagTextActive: { color: '#3730a3', fontWeight: '700' },
  fieldLabel: { fontSize: 12, color: '#555', marginBottom: 6 },
  dateInput: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12 },
  dateText: { color: '#111' },
  clearDate: { marginTop: 6 },
  clearDateText: { color: '#2563eb', fontSize: 12 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 14 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  btnGhost: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  btnGhostText: { color: '#111' },
  btnLight: { backgroundColor: '#f3f4f6' },
  btnPrimary: { backgroundColor: '#2563eb' },
  btnText: { fontWeight: '700' },
});
