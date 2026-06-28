import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function WorkoutRecord() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  return (
    <View>
      <Text>workout-record-id: {workoutId}</Text>
    </View>
  );
}
