// screens/Summary.tsx
import React from 'react'
import { View, Text } from 'react-native'

export default function Summary() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>
        Session summary goes here (map + stats + photos)
      </Text>
    </View>
  )
}
