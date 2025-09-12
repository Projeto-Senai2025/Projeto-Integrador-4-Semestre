// app/(tabs)/medicao.tsx
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Menu, Thermometer, Droplet, Waves, AlertTriangle } from 'lucide-react-native';
import { useGreenhouses } from '../_store/greenhouses';
import { useNotifications } from '..//_store/notifications';

export default function MedicaoScreen() {
  const items = useGreenhouses((s) => s.items);
  const update = useGreenhouses((s) => s.update);
  const addNotification = useNotifications((s) => s.add);

  // seleciona a 1ª estufa por padrão
  const [selectedId, setSelectedId] = useState<string>(() => items[0]?.id ?? '');
  useEffect(() => {
    if (!items.find(g => g.id === selectedId) && items[0]) setSelectedId(items[0].id);
  }, [items.length]);

  const gh = useMemo(() => items.find(g => g.id === selectedId), [items, selectedId]);

  // notificação de temperatura alta (evita flood)
  const hasAlerted = useRef(false);
  useEffect(() => {
    if (!gh) return;
    if (gh.temperature > gh.tempThreshold && !hasAlerted.current) {
      hasAlerted.current = true;
      addNotification({
        title: `Temperatura alta - ${gh.name}`,
        body: `Leitura: ${gh.temperature}°C (limite ${gh.tempThreshold}°C).`,
        level: 'danger',
      });
    }
    if (gh.temperature <= gh.tempThreshold) hasAlerted.current = false;
  }, [gh?.temperature, gh?.tempThreshold]);

  // simulação de pico ao tocar no cartão de temperatura
  const toggleTemp = () => gh && update(gh.id, { temperature: gh.temperature > 30 ? 23 : 35 });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medição</Text>
        <Pressable
          onPress={() => router.push('/estufas/manage')}
          style={styles.iconBtn}
          hitSlop={10}
          accessibilityLabel="Gerenciar estufas"
        >
          <Menu size={18} color="#065F46" />
        </Pressable>
      </View>

      {/* Nome da estufa CENTRALIZADO */}
      <Pressable style={styles.ghNameWrap} onPress={() => router.push('/estufas/manage')}>
        <Text style={styles.ghName}>{gh?.name ?? '—'}</Text>
      </Pressable>

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {gh && gh.temperature > gh.tempThreshold && (
          <Pressable style={styles.alert} onPress={() => router.push('/notifications')}>
            <AlertTriangle size={28} color="#DC2626" />
            <Text style={styles.alertText}>ATENÇÃO: Temperatura acima do limite!</Text>
          </Pressable>
        )}

        <Pressable style={styles.card} onPress={toggleTemp}>
          <Thermometer size={36} color="#111827" />
          <Text style={styles.value}>{gh?.temperature ?? '--'}°C</Text>
          <Text style={styles.label}>Temperatura</Text>
        </Pressable>

        <View style={{ height: 12 }} />

        <View style={styles.card}>
          <Droplet size={36} color="#111827" />
          <Text style={styles.value}>{gh?.airHumidity ?? '--'}%</Text>
          <Text style={styles.label}>Umidade do Ar</Text>
        </View>

        <View style={{ height: 12 }} />

        <View style={styles.card}>
          <Waves size={36} color="#111827" />
          <Text style={styles.value}>{gh?.soilHumidity ?? '--'}%</Text>
          <Text style={styles.label}>Umidade do Solo</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F6E7' },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#065F46' },
  iconBtn: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(6,95,70,0.08)',
  },

  // título centralizado da estufa
  ghNameWrap: { alignItems: 'center', marginTop: 4, marginBottom: 8 },
  ghName: { fontSize: 20, fontWeight: '800', color: '#065F46' },

  content: { padding: 16, alignItems: 'center', paddingBottom: 24 },

  card: {
    width: '82%', maxWidth: 360, backgroundColor: '#fff',
    borderRadius: 12, paddingVertical: 24, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  value: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 8 },
  label: { fontSize: 13, color: '#111827', marginTop: 6, fontWeight: '700' },

  alert: {
    width: '88%', maxWidth: 380,
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    marginBottom: 12, alignItems: 'center', flexDirection: 'row', gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
    borderWidth: 1, borderColor: '#FECACA',
  },
  alertText: { color: '#DC2626', fontWeight: '700', fontSize: 14 },
});
