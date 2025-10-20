import React, { useState } from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import { useAuth } from '../state/auth'

export default function Login() {
  const { signIn } = useAuth()
  const [name, setName] = useState('')
  return (
    <View style={{ flex:1, justifyContent:'center', padding:24, gap:12 }}>
      <Text style={{ fontSize:22, fontWeight:'700' }}>Welcome</Text>
      <Text>Enter a display name to continue:</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Your name"
        style={{ borderWidth:1, borderRadius:8, padding:12 }} />
      <Button title="Continue" onPress={() => name.trim() && signIn({ id: 'local', name: name.trim() })} />
    </View>
  )
}

