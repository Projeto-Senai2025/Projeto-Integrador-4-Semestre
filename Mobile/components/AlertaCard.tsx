import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { Alerta } from '@/types';

interface AlertaCardProps {
  alerta: Alerta;
  onPress?: () => void;
}

export default function AlertaCard({ alerta, onPress }: AlertaCardProps) {
  const isCritical = alerta.nivel === 'CRITICAL';
  const color = isCritical ? '#dc2626' : '#f59e0b';
  const Icon = isCritical ? AlertCircle : AlertTriangle;

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Icon size={28} color={color} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.nivel, { color }]}>
            {alerta.nivel === 'CRITICAL' ? 'CRÍTICO' : 'AVISO'}
          </Text>
        </View>
        <Text style={styles.tipo}>{alerta.tipo}</Text>
        <Text style={styles.mensagem}>{alerta.mensagem}</Text>
        <Text style={styles.dataHora}>
          {new Date(alerta.dataHora).toLocaleString('pt-BR')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: 4,
  },
  nivel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tipo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  mensagem: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  dataHora: {
    fontSize: 12,
    color: '#999',
  },
});
