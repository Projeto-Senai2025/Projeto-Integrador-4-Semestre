import { Tabs } from 'expo-router';
import { Hop as Home, Activity, ChartBar as BarChart3, TriangleAlert as AlertTriangle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#0066cc',
        tabBarInactiveTintColor: '#999',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sensores"
        options={{
          title: 'Sensores',
          tabBarIcon: ({ size, color }) => <Activity size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leituras"
        options={{
          title: 'Leituras',
          tabBarIcon: ({ size, color }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ size, color }) => <AlertTriangle size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
