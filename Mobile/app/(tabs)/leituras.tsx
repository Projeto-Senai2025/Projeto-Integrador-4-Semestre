import React, { useEffect, useMemo, useState } from 'react';
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
  Pressable,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import { Plus, ListFilter as Filter, FileText } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { sensorDataService } from '@/services/sensorData';
import { sensorsService } from '@/services/sensors';
import { SensorData, Sensor, SensorTipo } from '@/types';
import SensorDataCard from '@/components/SensorDataCard';

type FieldKey = 'tipo' | 'sensorId' | 'valor' | 'dataHora' | 'localizacao';

const TYPE_OPTIONS: SensorTipo[] = ['TEMPERATURA_AR','UMIDADE_AR','UMIDADE_SOLO'];

export default function LeiturasScreen() {
  const [leituras, setLeituras] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<SensorTipo[]>(['TEMPERATURA_AR']);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [typesVisible, setTypesVisible] = useState(false);

  // Fields to include in PDF
  const [fields, setFields] = useState<Record<FieldKey, boolean>>({
    tipo: true,
    sensorId: false,
    valor: true,
    dataHora: true,
    localizacao: false,
  });

  // Date filters (last 7 days default)
  const [dateFrom, setDateFrom] = useState<Date>(new Date(Date.now() - 7*24*60*60*1000));
  const [dateTo, setDateTo] = useState<Date>(new Date());

  const loadAll = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [allData, allSensors] = await Promise.all([
        sensorDataService.getAll(),
        sensorsService.getAll()
      ]);
      // Sort desc by dataHora
      const sorted = [...allData].sort((a,b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
      setLeituras(sorted);
      setSensors(allSensors);
    } catch (e:any) {
      setError('Erro ao carregar leituras');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAll();
  };

  const sensorById = useMemo(() => {
    const map = new Map<number, Sensor>();
    sensors.forEach(s => map.set(Number(s.id as any), s));
    return map;
  }, [sensors]);

  const filteredData = useMemo(() => {
    const start = dateFrom.getTime();
    const end = dateTo.getTime();
    return leituras.filter(d => {
      const s = sensorById.get(Number(d.sensorId as any));
      const tipo = (s?.tipo || '') as SensorTipo;
      const t = new Date(d.dataHora).getTime();
      return s && selectedTypes.includes(tipo) && t >= start && t <= end;
    });
  }, [leituras, sensorById, selectedTypes, dateFrom, dateTo]);

  // ---------- UI Helpers ----------
  const toggleType = (t: SensorTipo) => {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const toggleField = (k: FieldKey) => {
    setFields(prev => ({...prev, [k]: !prev[k]}));
  };

  const formatDate = (iso: string | Date) => {
    const d = typeof iso === 'string' ? new Date(iso) : iso;
    return d.toLocaleString();
  };

  // ---------- PDF Generation ----------
  const gerarPDF = async () => {
    try {
      if (!filteredData.length) {
        Alert.alert('Sem dados', 'Não há leituras para gerar o relatório com os filtros atuais.');
        return;
      }
      // Summary
      const valores = filteredData.map(d => d.valor ?? 0).filter(v => !isNaN(v));
      const soma = valores.reduce((a,b)=>a+b,0);
      const media = (soma / valores.length);
      const min = Math.min(...valores);
      const max = Math.max(...valores);

      const rows = filteredData.map(d => {
        const s = sensorById.get(Number(d.sensorId as any));
        const cells: string[] = [];
        if (fields.tipo) cells.push(`<td>${s?.tipo ?? '-'}</td>`);
        if (fields.sensorId) cells.push(`<td>${d.sensorId}</td>`);
        if (fields.valor) cells.push(`<td>${d.valor}</td>`);
        if (fields.dataHora) cells.push(`<td>${formatDate(d.dataHora)}</td>`);
        if (fields.localizacao) cells.push(`<td>${s?.localizacao ?? '-'}</td>`);
        return `<tr>${cells.join('')}</tr>`;
      }).join('');

      const headerCells: string[] = [];
      if (fields.tipo) headerCells.push('<th>Tipo</th>');
      if (fields.sensorId) headerCells.push('<th>Sensor</th>');
      if (fields.valor) headerCells.push('<th>Valor</th>');
      if (fields.dataHora) headerCells.push('<th>Data/Hora</th>');
      if (fields.localizacao) headerCells.push('<th>Localização</th>');
      const header = `<tr>${headerCells.join('')}</tr>`;

      const html = `
        <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, Roboto, Arial, sans-serif; padding: 24px; }
            h1 { margin: 0 0 8px 0; }
            h2 { margin: 16px 0 8px 0; font-size: 16px; }
            .pill { display:inline-block; padding:4px 10px; border-radius: 999px; background:#eef5ff; color:#1d4ed8; margin-right:6px; font-size:12px;}
            table { width:100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
            th { background:#f7f7f7; text-align:left; }
            .grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 8px;}
            .stat { background:#fafafa; border:1px solid #eee; border-radius:12px; padding:12px; }
            .muted { color:#666; font-size:12px; }
          </style>
        </head>
        <body>
          <h1>Relatório de Leituras</h1>
          <div class="muted">Período: ${formatDate(dateFrom)} — ${formatDate(dateTo)}</div>
          <div style="margin-top:8px;">
            ${selectedTypes.map(t => `<span class="pill">${t}</span>`).join('')}
          </div>

          <h2>Resumo</h2>
          <div class="grid">
            <div class="stat"><div class="muted">Quantidade</div><div><b>${valores.length}</b></div></div>
            <div class="stat"><div class="muted">Média</div><div><b>${media.toFixed(2)}</b></div></div>
            <div class="stat"><div class="muted">Mínimo</div><div><b>${min}</b></div></div>
            <div class="stat"><div class="muted">Máximo</div><div><b>${max}</b></div></div>
          </div>

          <h2>Detalhes</h2>
          <table>
            ${header}
            ${rows}
          </table>
        </body>
        </html>
      `;

      const file = await Print.printToFileAsync({ html });
      if (Platform.OS === 'ios' || (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(file.uri, { dialogTitle: 'Relatório de Leituras' });
      } else {
        Alert.alert('PDF gerado', `Arquivo salvo em: ${file.uri}`);
      }
    } catch (e:any) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header buttons */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => setFiltersVisible(true)}>
          <Filter size={18} color="#1f2937" />
          <Text style={styles.headerBtnText}>Filtrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn} onPress={gerarPDF}>
          <FileText size={18} color="#1f2937" />
          <Text style={styles.headerBtnText}>Relatório</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <SensorDataCard data={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.center}><Text>Nenhuma leitura encontrada.</Text></View>
          }
        />
      )}

      {/* Floating + button to pick types */}
      <TouchableOpacity style={styles.fab} onPress={() => setTypesVisible(true)}>
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      {/* Types Modal */}
      <Modal visible={typesVisible} transparent animationType="fade" onRequestClose={() => setTypesVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setTypesVisible(false)}>
          <View />
        </Pressable>
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>Tipos de leitura</Text>
          {TYPE_OPTIONS.map((t) => (
            <Pressable key={t} style={styles.row} onPress={() => toggleType(t)}>
              <Text style={styles.rowText}>{t}</Text>
              <View style={[styles.checkbox, selectedTypes.includes(t) && styles.checkboxOn]} />
            </Pressable>
          ))}
          <View style={{ height: 8 }} />
          <TouchableOpacity style={styles.primary} onPress={() => setTypesVisible(false)}>
            <Text style={styles.primaryText}>Aplicar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Filters Modal */}
      <Modal visible={filtersVisible} transparent animationType="fade" onRequestClose={() => setFiltersVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setFiltersVisible(false)}>
          <View />
        </Pressable>
        <View style={styles.bottomSheetLarge}>
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={styles.sheetTitle}>Filtros & Campos do PDF</Text>

            <Text style={styles.sectionTitle}>Período</Text>
            <View style={styles.row}>
              <Text style={styles.rowText}>Início: {formatDate(dateFrom)}</Text>
              <TouchableOpacity style={styles.link} onPress={() => {
                // -1 dia
                setDateFrom(new Date(Date.now() - 24*60*60*1000));
              }}>
                <Text style={styles.linkText}>Últimas 24h</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowText}>Fim: {formatDate(dateTo)}</Text>
              <TouchableOpacity style={styles.link} onPress={() => setDateTo(new Date())}>
                <Text style={styles.linkText}>Agora</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Campos no PDF</Text>
            {(['tipo','sensorId','valor','dataHora','localizacao'] as FieldKey[]).map((k) => (
              <View key={k} style={styles.row}>
                <Text style={styles.rowText}>{k}</Text>
                <Switch value={fields[k]} onValueChange={() => toggleField(k)} />
              </View>
            ))}

            <View style={{ height: 12 }} />
            <TouchableOpacity style={styles.primary} onPress={() => setFiltersVisible(false)}>
              <Text style={styles.primaryText}>Aplicar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
  },
  headerBtnText: { fontSize: 14, color: '#1f2937' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: '#b91c1c' },
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bottomSheetLarge: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    maxHeight: '80%',
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowText: { fontSize: 14, color: '#111827' },
  checkbox: {
    width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: '#93c5fd',
  },
  checkboxOn: {
    backgroundColor: '#60a5fa',
  },
  primary: {
    marginTop: 8,
    backgroundColor: '#1d4ed8',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '600' },
  link: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#eef2ff' },
  linkText: { color: '#3730a3', fontSize: 12, fontWeight: '600' },
});
