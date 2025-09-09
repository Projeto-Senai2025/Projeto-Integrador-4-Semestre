import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Bell } from 'lucide-react-native';

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Temperatura Alta', body: 'Estufa A > 33ºC por 10 min.', date: 'Hoje 14:02' },
  { id: '2', title: 'Umidade Baixa', body: 'Estufa B < 40% RH.', date: 'Hoje 09:47' },
  { id: '3', title: 'Irrigação Concluída', body: 'Ciclo automático finalizado.', date: 'Ontem 18:20' },
  { id: '4', title: 'Porta Aberta', body: 'Estufa C aberta por 15 min.', date: 'Ontem 16:05' },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header com voltar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <ChevronLeft size={20} color="#065F46" />
        </Pressable>
        <Text style={styles.headerTitle}>Histórico de Notificações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {MOCK_NOTIFICATIONS.map((n) => (
          <View key={n.id} style={styles.item}>
            <View style={styles.itemIcon}>
              <Bell size={16} color="#065F46" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{n.title}</Text>
              <Text style={styles.itemBody}>{n.body}</Text>
              <Text style={styles.itemDate}>{n.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  back: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(6,95,70,0.08)',
  },
  headerTitle: { marginLeft: 8, fontSize: 16, fontWeight: '700', color: '#065F46' },
  list: { padding: 16, gap: 12 },
  item: {
    flexDirection: 'row', gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12, padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  itemIcon: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(6,95,70,0.08)',
  },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  itemBody: { fontSize: 13, color: '#374151', marginTop: 2 },
  itemDate: { fontSize: 12, color: '#6B7280', marginTop: 6 },
});
