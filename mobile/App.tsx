import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthProvider, useAuth } from './state/auth'
import Login from './screens/login'        // <- note lowercase to match your file
import RecordPick from './screens/RecordPick'
import Photos from './screens/Photos'
import Summary from './screens/Summary'

export type RootStackParamList = {
  Login: undefined
  RecordPick: undefined
  Photos: { stage: 'before' | 'during' | 'after' }
  Summary: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

function AppNavigator() {
  const { user } = useAuth()
  console.log('Auth user is:', user)

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerBackTitle: 'Back' }}>
        {user ? (
          <>
            <Stack.Screen name="RecordPick" component={RecordPick} options={{ title: 'Start Pick' }} />
            <Stack.Screen name="Photos" component={Photos} options={{ title: 'Proof Photos' }} />
            <Stack.Screen name="Summary" component={Summary} options={{ title: 'Session Summary' }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  )
}
