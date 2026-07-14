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
  TextInput,
} from "react-native";
import { Text } from "react-native";
import { useStopwatch } from "react-timer-hook";
import { useWorkoutStore, WorkoutSet } from "store/workout-store";

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

  const deleteExercise = (exerciseId: string) => {
    setWorkoutExercises((exercises) =>
      exercises.filter((exercise) => exercise.id !== exerciseId),
    );
  };

  const addNewSet = (exerciseId: string) => {
    const newSet: WorkoutSet = {
      id: Math.random().toString(),
      reps: "",
      weight: "",
      weightUnit: weightUnit,
      isCompleted: false,
    };

    setWorkoutExercises((exercises: any) =>
      exercises.map((exercise: any) =>
        exercise.id === exerciseId
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise,
      ),
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: "reps" | "weight",
    value: string,
  ) => {
    setWorkoutExercises((exercises: any) =>
      exercises.map((exercise: any) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set: any) =>
                set.id === setId ? { ...set, [field]: value } : set,
              ),
            }
          : exercise,
      ),
    );
  };

  const deleteSet = (exerciseId: string, setId: string) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setId),
            }
          : exercise,
      ),
    );
  };

  const toggleSetCompletion = (exerciseId: string, setId: string) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId
                  ? { ...set, isCompleted: !set.isCompleted }
                  : set,
              ),
            }
          : exercise,
      ),
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
          <Text className="text-right text-gray-600 mb-2">
            {workoutExercises.length}
            {workoutExercises.length <= 1 ? " exercício" : " exercícios"}
          </Text>
        </View>
      </View>

      {/* If no exercises, show a message */}
      {workoutExercises.length === 0 && (
        <View className="bg-gray-50 rounded-2xl p-8 items-center mx-6">
          <Ionicons name="barbell-outline" size={48} color="#9CA3AF" />
          <Text className="text-gray-600 text-lg text-center mt-4font-medium">
            Ainda não há exercícios.
          </Text>
          <Text className="text-gray-500 text-center mt-2">
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
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/exercise-detail",
                    params: {
                      id: exercise.sanityId,
                    },
                  })
                }
                className="bg-gray-200 rounded-tl-2xl rounded-tr-2xl p-4"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-gray-600 mb-2">
                      {exercise.name}
                    </Text>
                    <Text className="text-gray-600">
                      {exercise.sets.length} séries •{" "}
                      {exercise.sets.filter((set) => set.isCompleted).length}{" "}
                      completado
                    </Text>
                  </View>
                  {/* Delete Exercise Button */}
                  <TouchableOpacity
                    onPress={() => deleteExercise(exercise.id)}
                    className="w-10 h-10 rounded-xl items-center justify-center bg-red-500 ml-3"
                  >
                    <Ionicons name="trash" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              {/* Exercise Sets */}
              <View className="bg-white rounded-bl-2xl rounded-br-2xl p-4 shadow-sm border border-gray-100 mb-3">
                <Text className="text-lg font-semibold Otext-gray-900 mb-3">
                  Séries
                </Text>
                {exercise.sets.length === 0 ? (
                  <Text className="text-gray-500 text-center py-4">
                    Ainda não há séries. Adicione seu primeiro série abaixo.
                  </Text>
                ) : (
                  exercise.sets.map((set, setIndex) => (
                    <View
                      key={set.id}
                      className={`py-3 px-3 mb-2 rounded-lg border ${
                        set.isCompleted
                          ? "bg-green-100 border-green-300"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      {/* First Row: Set number, Reps, Weight, Complete button, Delete button */}
                      <View className="flex-row items-center justify-between"></View>
                      <View className="flex-row items-center justify-between gap-2">
                        <Text className="text-gray-700">
                          Série {setIndex + 1}
                        </Text>
                        {/* Reps input */}
                        <View className="flex-1 mx-2">
                          <Text className="text-xs Itext-gray-500 mb-1">
                            Repetidos
                          </Text>
                          <TextInput
                            value={set.reps}
                            onChangeText={(value) =>
                              updateSet(exercise.id, set.id, "reps", value)
                            }
                            placeholder="0"
                            keyboardType="numeric"
                            className={`border rounded-lg px-3 py-px text-center ${
                              set.isCompleted
                                ? "bg-gray-100 border-gray-300 text-gray-300"
                                : "bg-white border-gray-300"
                            }`}
                            editable={!set.isCompleted}
                          />
                        </View>
                        {/* Weight Input */}
                        <View className="flex-1 mx-2">
                          <Text className="text-xs text-gray-500 mb-1">
                            Peso ({weightUnit})
                          </Text>
                          <TextInput
                            value={set.weight}
                            onChangeText={(value) =>
                              updateSet(exercise.id, set.id, "weight", value)
                            }
                            placeholder="0"
                            keyboardType="numeric"
                            className={`border rounded-lg px-3 py-px text-center ${
                              set.isCompleted
                                ? "bg-gray-100 border-gray-300 text-gray-300"
                                : "bg-white border-gray-300"
                            }`}
                            editable={!set.isCompleted}
                          />
                        </View>
                        {/* Complete Button */}
                        <TouchableOpacity
                          onPress={() =>
                            toggleSetCompletion(exercise.id, set.id)
                          }
                          className={`w-12 h-12 rounded-xl items-center justify-center mx-1 ${set.isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                        >
                          <Ionicons
                            name={
                              set.isCompleted
                                ? "checkmark"
                                : "checkmark-outline"
                            }
                            size={20}
                            color={set.isCompleted ? "white" : "#9CA3AF"}
                          />
                        </TouchableOpacity>

                        {/* Delete Button */}
                        <TouchableOpacity
                          onPress={() => deleteSet(exercise.id, set.id)}
                          className="w-12 h-12 rounded-xl items-center justify-center bg-red-500 ml-1"
                        >
                          <Ionicons name="trash" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}

                {/* Add New Set Button */}
                <TouchableOpacity
                  onPress={() => addNewSet(exercise.id)}
                  className="bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg py-3 items-center mt-2"
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name="add"
                      size={16}
                      color="#3B82F6"
                      style={{ marginRight: 6 }}
                    />
                    <Text className="text-blue-600 font-medium">
                      Adicione série
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
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
