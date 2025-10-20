// mobile/screens/RecordPick.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, Text, Button, StyleSheet, Alert } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import * as Location from 'expo-location'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../App'
import { useAuth } from '../state/auth'   // <-- import the auth hook

type Props = NativeStackScreenProps<RootStackParamList, 'RecordPick'>
type LatLng = { latitude: number; longitude: number }

export default function RecordPick({ navigation }: Props) {
  const { signOut } = useAuth()
  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => <Button title="Sign out" onPress={signOut} /> })
  }, [navigation, signOut])
  // ------------------------------

  const [recording, setRecording] = useState(false)
  const [coords, setCoords] = useState<LatLng[]>([])
  const [distanceM, setDistanceM] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const watchRef = useRef<Location.LocationSubscription | null>(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required for tracking.')
      }
    })()
    return () => watchRef.current?.remove()
  }, [])

  const start = async () => {
    setRecording(true)
    setCoords([])
    setDistanceM(0)
    setStartTime(Date.now())
    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 5, timeInterval: 2000 },
      (loc) => {
        const { latitude, longitude } = loc.coords
        setCoords((prev) => {
          if (prev.length) {
            const last = prev[prev.length - 1]
            setDistanceM((m) => m + haversine(last.latitude, last.longitude, latitude, longitude))
          }
          return [...prev, { latitude, longitude }]
        })
      }
    )
  }

  const pause = () => {
    watchRef.current?.remove()
    watchRef.current = null
    setRecording(false)
  }

  const finish = () => {
    pause()
    navigation.navigate('Summary')
  }

  const last = coords[coords.length - 1]
  const region = last
    ? { ...last, latitudeDelta: 0.005, longitudeDelta: 0.005 }
    : { latitude: 51.5074, longitude: -0.1278, latitudeDelta: 0.05, longitudeDelta: 0.05 }

  const durationMin = startTime ? Math.max(0, (Date.now() - startTime) / 60000) : 0
  const pace = distanceM > 0 ? (durationMin / (distanceM / 1000)).toFixed(1) : '–'

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} region={region}>
        {coords.length > 1 && <Polyline coordinates={coords} strokeWidth={4} />}
      </MapView>
      <View style={styles.panel}>
        <Text>Distance: {(distanceM / 1000).toFixed(2)} km</Text>
        <Text>Time: {durationMin.toFixed(1)} min</Text>
        <Text>Pace: {pace} min/km</Text>
        <View style={styles.row}>
          {!recording ? <Button title="Start" onPress={start} /> : <Button title="Pause" onPress={pause} />}
          <Button title="Photos" onPress={() => navigation.navigate('Photos', { stage: 'before' })} />
          <Button title="Finish" onPress={finish} />
        </View>
      </View>
    </View>
  )
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000
  const toRad = (n: number) => (n * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const styles = StyleSheet.create({
  panel: { padding: 12, gap: 6, backgroundColor: 'white' },
  row: { flexDirection: 'row', gap: 8, marginTop: 6, justifyContent: 'space-between' },
})
