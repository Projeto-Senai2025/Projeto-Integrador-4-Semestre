import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, TextInput, FlatList } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, PlusCircle } from 'lucide-react-native';
import { useGreenhouses } from '../_store/greenhouses';

export default function ManageGreenhouses() {
  const items = useGreenhouses((s) => s.items);
  const add = useGreenhouses((s) => s.add);
  const [name, setName] = useState('');

  const handleAdd = () => {
    const n = name.trim() || `Estufa ${items.length + 1}`;
    add(n);
    setName('');
    router.back(); // volta para a aba Medição
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <ChevronLeft size={20} color="#065F46" />
        </Pressable>
        <Text style={styles.headerTitle}>Estufas</Text>
        <View style={styles.iconBtn} />
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <View style={styles.row}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nome da nova estufa"
            style={styles.input}
          />
          <Pressable onPress={handleAdd} style={styles.addBtn}>
            <PlusCircle size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16, gap: 10 }}
        data={items}
        keyExtractor={(g) => g.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={{ fontWeight: '600', color: '#065F46' }}>{item.name}</Text>
            <Text style={{ color: '#6B7280', marginTop: 4, fontSize: 12 }}>
              {item.temperature}°C • {item.airHumidity}% Ar • {item.soilHumidity}% Solo
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: {
    paddingHorizontal: 12, paddingTop: 8, paddingBottom: 8,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  iconBtn: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(6,95,70,0.08)',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#065F46' },

  row: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1, backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E5E7EB',
  },
  addBtn: {
    width: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#22C55E',
  },

  item: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
});
