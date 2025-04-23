import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PROGRESS = '@user_progress';

export default function ProgressScreen() {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_PROGRESS);
        setDataPoints(stored ? JSON.parse(stored) : [1,2,3,4,5,6,7]);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const screenWidth = Dimensions.get('window').width - 32;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İlerleme Grafiği</Text>
      {dataPoints.length > 0 && (
        <LineChart
          data={{
            labels: dataPoints.map((_, i) => `${i+1}`),
            datasets: [{ data: dataPoints }]
          }}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity=1) => `rgba(0,122,255,${opacity})`,
            labelColor: (opacity=1) => `rgba(0,0,0,${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '4', strokeWidth: '2', stroke: '#007AFF' }
          }}
          style={{ marginVertical: 16, borderRadius: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'flex-start', padding:16 },
  title: { fontSize:20, fontWeight:'bold', marginBottom:12 }
});
