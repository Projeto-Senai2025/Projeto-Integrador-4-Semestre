import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';

export default function InicioScreen() {
  const goToNotifications = () => router.push('/notifications');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com sininho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Início</Text>
        <Pressable
          onPress={goToNotifications}
          hitSlop={10}
          style={styles.bellBtn}
          accessibilityLabel="Abrir notificações"
          accessibilityRole="button"
        >
          <Bell size={20} color="#065F46" />
        </Pressable>
      </View>

      {/* Conteúdo centralizado */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card clicável */}
        <Pressable style={styles.card} onPress={goToNotifications}>
          <Text style={styles.cardTitle}>
            Bem-vindo à sua plataforma de monitoramento para estufas inteligentes!
          </Text>
          <Text style={styles.cardText}>
            Aqui, você acompanha temperatura, umidade do ar e do solo para um cultivo ideal.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estufa Inteligente</Text>
            <Text style={styles.infoRow}>Temperatura atual: <Text style={styles.infoValue}>25°C</Text></Text>
          </View>

          <View style={styles.bullets}>
            <Text style={styles.bullet}>• Monitora e ajusta a umidade do ar de acordo com as necessidades das plantas.</Text>
            <Text style={styles.bullet}>• Gerencia a irrigação e a umidade do solo para evitar desperdícios e otimizar o crescimento.</Text>
          </View>

          <Text style={styles.hint}>
            Para ver as notificações, toque no <Text style={styles.bold}>sininho no canto superior direito</Text>.
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#065F46' },
  bellBtn: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(6,95,70,0.08)',
  },

  // centraliza o card
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },

  // card branco
  card: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 6 },
  cardText: { fontSize: 13, color: '#374151', lineHeight: 18, marginBottom: 12 },

  section: { marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#065F46', marginBottom: 4 },
  infoRow: { fontSize: 13, color: '#374151' },
  infoValue: { fontWeight: '700' },

  bullets: { gap: 6, marginTop: 8, marginBottom: 12 },
  bullet: { fontSize: 13, color: '#374151', lineHeight: 18 },

  hint: { fontSize: 12, color: '#6B7280' },
  bold: { fontWeight: '700' },
});
