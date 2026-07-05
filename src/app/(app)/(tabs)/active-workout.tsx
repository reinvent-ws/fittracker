import ExerciseSelectionModal from "@/app/components/ExerciseSelectionModal";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
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
  const [showExerciseSelection, setShowExerciseSelection] =
    useState<boolean>(false);

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

  const addExercise = () => {
    setShowExerciseSelection(true);
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
      />
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
      <View className="bg-transparent">
        {/* Workout Progress */}
        <View className="px-6 mt-4">
          <Text className="text-center text-gray-600 mb-2">
            {workoutExercises.length}
            {workoutExercises.length <= 1 ? " exercício" : " exercícios"}
          </Text>
        </View>
      </View>

      {/* If no exercises, show a message */}
      {workoutExercises.length === 0 && (
        <View className="bg-gray-50 rounded-2xl p-8 items-center mx-6">
          <Ionicons name="barbell-outline" size={48} color="#9CA3AF" />
          <Text className="Otext-gray-600 text-lg text-center mt-4font-medium">
            Ainda não há exercícios.
          </Text>
          <Text className="Otext-gray-500 text-center mt-2">
            Comece adicionando seu primeiro exercício abaixo.
          </Text>
        </View>
      )}

      {/* All Exercises - Vertical List */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 mt-4">
          {workoutExercises.map((exercise) => (
            <View key={exercise.id} className="mb-8">
              {/* Exercise Header */}
              <View></View>
            </View>
          ))}

          {/* Add Exercise Button */}
          <TouchableOpacity
            onPress={addExercise}
            className="bg-blue-600 rounded-2xl py-4 items-center mb-8 first-line:active:bg-blue-700"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="add"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-semibold text-lg">
                Adicionar Exercício
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Exercise Selection Modal */}
      <ExerciseSelectionModal
        visible={showExerciseSelection}
        onClose={() => setShowExerciseSelection(false)}
      />
    </View>
  );
}
