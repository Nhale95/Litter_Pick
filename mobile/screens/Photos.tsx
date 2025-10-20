// mobile/screens/Photos.tsx
import React from 'react'
import { View, Text, Button } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../App'

type Props = NativeStackScreenProps<RootStackParamList, 'Photos'>

export default function Photos({ navigation, route }: Props) {
  const stage = route.params?.stage ?? 'before'
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text>Photos screen – stage: {stage}</Text>
      <Button title="Next" onPress={() => navigation.navigate('Summary')} />
    </View>
  )
}
