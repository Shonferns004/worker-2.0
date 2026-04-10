import React from 'react'
import { Stack } from 'expo-router'

const JobsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="live-job" />
      <Stack.Screen name="inspect" />
      <Stack.Screen name="approval-pending" />
      <Stack.Screen name="work-in-progress" />
      <Stack.Screen name="payment-qr" />
    </Stack>
  )
}

export default JobsLayout
