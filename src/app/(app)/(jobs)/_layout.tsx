import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const JobsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="live-job" />
      <Stack.Screen name="inspect" />
    </Stack>
  )
}

export default JobsLayout