import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const CourseLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="[id]" options={{headerShown:false}} />
        <Stack.Screen name="content" options={{headerShown:false}} />
        <Stack.Screen name="enroll" options={{headerShown:false}} />
        <Stack.Screen name="success" options={{headerShown:false}} />
    </Stack>
  )
}

export default CourseLayout