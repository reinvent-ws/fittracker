import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native";
import { useStopwatch } from "react-timer-hook";
import { useWorkoutStore } from "store/workout-store";

export default function ActiveWorkout() {
  const {
    workoutExercises,
    setWorkoutExercises,
    resetWorkout,
    weightUnit,
    setWeightUnit,
  } = useWorkoutStore();
  const router = useRouter();
  const { minutes, seconds, hours, totalSeconds, reset } = useStopwatch({
    autoStart: true,
  });

  // Reset timer when screen is focused and no active workout (fresh start)
  useFocusEffect(
    React.useCallback(() => {
      // Only reset if we have no exercises (indicates a fresh start after ending workout)
      if (workoutExercises.length === 0) {
        reset();
      }
    }, [workoutExercises.length, reset]),
  );

  const getWorkoutDuration = () => {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const cancelWorkout = () => {
    Alert.alert(
      "Cancelar o treino",
      "Tem certeza de que deseja cancelar o treino?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Encerrar treino",
          onPress: () => {
            resetWorkout();
            router.back();
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      {/* Top Safe Area */}
      <View
        className="bg-gray-800"
        style={{
          paddingTop: Platform.OS === "ios" ? 55 : StatusBar.currentHeight || 0,
        }}
      >
        {/* Header */}
        <View className="bg-gray-800 px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-xl font-semibold">
                Treino Ativo
              </Text>
              <Text className="text-gray-300">{getWorkoutDuration()}</Text>
            </View>
            <View className="flex-row items-center space-x-3 gap-2">
              {/* Weight Unit Toggle */}
              <View className="flex-row bg-gray-700 rounded-lg p-1">
                <TouchableOpacity
                  onPress={() => setWeightUnit("kg")}
                  className={`px-3 py-1 rounded ${weightUnit === "kg" ? "bg-blue-600" : ""}`}
                >
                  <Text
                    className={`tekt-sm font-medium ${weightUnit === "kg" ? "text-white" : "text-gray-300"}`}
                  >
                    kg
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setWeightUnit("lbs")}
                  className={`px-3 py-1 rounded ${weightUnit === "lbs" ? "bg-blue-600" : ""}
              `}
                >
                  <Text
                    className={`text-sm font-medium ${weightUnit === "lbs" ? "text-white" : "text-gray-300"}`}
                  >
                    lbs
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={cancelWorkout}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">Cancelar treino</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content Area with White Background */}
        <View className="flex-1 bg-white">
          {/* Workout Progress */}
          <View className="px-6 mt-4">
            <Text className="text-center Otext-gray-600 mb-2">
              {workoutExercises.length} Exercícios
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
