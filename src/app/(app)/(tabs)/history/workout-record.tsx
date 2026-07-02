import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { defineQuery } from "groq";
import { client } from "@/lib/sanity/client";
import { GetWorkoutRecordQueryResult } from "@/lib/sanity/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { formatDuration } from "@/utils";

const getWorkoutRecordQuery =
  defineQuery(`*[_type == "workout" && _id == $workoutId][0] {
_id,
_type,
_createdAt,
date,
duration,
exercises[] {
  exercise-> {
    _id,
    name,
    description
    },
    sets[] {
    reps,
    weight,
    weightUnit,
    _type,
    _key
    },
  _type,
  _key
  } 
}`);

export default function WorkoutRecord() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [workout, setWorkout] = useState<GetWorkoutRecordQueryResult | null>(
    null,
  );
  const router = useRouter();

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!workoutId) return;

      try {
        const result = await client.fetch(getWorkoutRecordQuery, {
          workoutId,
        });
        console.log("Result:", result);
        setWorkout(result);
      } catch (error) {
        console.error("Error fetching workout:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data desconhecida";

    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "Horário desconhecido";

    const date = new Date(timeString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
  };

  const formatWorkoutDuration = (seconds?: number) => {
    if (!seconds) return "Não tem registro de duração";
    return formatDuration(seconds);
  };

  const getTotalSets = () => {
    return (
      workout?.exercises?.reduce((total, exercise) => {
        return total + (exercise.sets?.length || 0);
      }, 0) || 0
    );
  };

  const getTotalVolume = () => {
    let totalVolume = 0;
    let unit = "lbs";

    workout?.exercises?.forEach((exercise) => {
      exercise.sets?.forEach((set) => {
        if (set.weight && set.reps) {
          totalVolume += set.weight * set.reps;
          unit = set.weightUnit || "lbs";
        }
      });
    });

    return { volume: totalVolume, unit };
  };

  const deleteWorkout = async () => {
    setDeleting(true);
    try {
      const response = await fetch("/api/delete-workout", {
        method: "POST",
        body: JSON.stringify({ workoutId: workout._id }),
      });

      const result = await response.json();

      if (result.success) {
        // FORÇA A ATUALIZAÇÃO:
        // Em vez de apenas voltar, vamos limpar o cache da navegação
        router.replace("/(tabs)/history");
      } else {
        Alert.alert("Erro", "Não foi possível deletar.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteWorkout = () => {
    Alert.alert(
      "Excluir treino",
      "Tem certeza de que deseja excluir este treino? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: deleteWorkout,
        },
      ],
    );
  };

  // ADICIONADO O RETURN ABAIXO
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-600 mt-4">Carregando treino...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ADICIONADO O RETURN E CORRIGIDO AS CLASSES ABAIXO
  if (!workout) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-xl font-semibold text-gray-900 mt-4">
            Treino não encontrado!
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Este registro de treino não foi encontrado.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-blue-600 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-medium">Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { volume, unit } = getTotalVolume();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Workout Summary */}
      <View className="bg-white p-6 border-b border-gray-300">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-900">
            Resumo do Treino
          </Text>
          <TouchableOpacity
            onPress={handleDeleteWorkout}
            disabled={deleting}
            className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                <Text className="text-white font-medium ml-2">Delete</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-3">
          <Ionicons name="calendar-outline" size={20} color="#6B7280" />
          <Text className="text-gray-700 ml-3 font-medium">
            {formatDate(workout?.date)} às {formatTime(workout?.date)}
          </Text>
        </View>

        <View className="flex-row items-center mb-3">
          <Ionicons name="time-outline" size={20} color="#6B7280" />
          <Text className="text-gray-700 ml-3 font-medium">
            {formatWorkoutDuration(workout?.duration)}
          </Text>
        </View>

        <View className="flex-row items-center mb-3">
          <Ionicons name="fitness-outline" size={20} color="#6B7280" />
          <Text className="text-gray-700 ml-3 font-medium">
            {workout?.exercises?.length || 0} exercícios
          </Text>
        </View>

        <View className="flex-row items-center mb-3">
          <Ionicons name="bar-chart-outline" size={20} color="#6B7280" />
          <Text className="text-gray-700 ml-3 font-medium">
            {getTotalSets()} total de séries
          </Text>
        </View>

        {volume > 0 && (
          <View className="flex-row items-center">
            <Ionicons name="barbell-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 ml-3 font-medium">
              {`${volume.toLocaleString()} ${unit} total do volume`}
            </Text>
          </View>
        )}
      </View>

      <ScrollView className="flex-1">
        {/* Exercise List */}
        <View className="space-y-4 p-6 gap-4">
          {workout?.exercises?.map((exerciseData, idx) => (
            <View
              key={exerciseData._key}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              {/* Exercise Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    {exerciseData.exercise?.name || "Exercício desconhecido"}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    {exerciseData.sets?.length || 0} séries completadas
                  </Text>
                </View>
                <View className="bg-blue-100 rounded-full w-10 h-10 items-center justify-center">
                  <Text className="text-blue-600 font-bold">{idx + 1}</Text>
                </View>
              </View>

              {/* Sets */}
              <View className="space-y-2">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Séries:
                </Text>
                {exerciseData.sets?.map((set, setIndex) => (
                  <View
                    key={set._key}
                    className="bg-gray-50 rounded-full p-2 mb-1 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center">
                      <View className="bg-gray-200 rounded-full w-6 h-6 items-center justify-center mr-3">
                        <Text className="text-gray-700 text-xs font-medium">
                          {setIndex + 1}
                        </Text>
                      </View>
                      <Text className="text-gray-900 font-medium">
                        {set.reps} repetições
                      </Text>
                    </View>

                    {set.weight ? (
                      <View className="flex-row items-center">
                        <Ionicons
                          name="barbell-outline"
                          size={16}
                          color="#6B7280"
                        />
                        <Text className="text-gray-700 ml-2 font-medium">
                          {set.weight} {set.weightUnit || "lbs"}
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-gray-400 text-sm italic">
                        Peso corporal
                      </Text>
                    )}
                  </View>
                ))}
              </View>

              {exerciseData.sets && exerciseData.sets.length > 0 && (
                <View className="mt-4 pt-4 border-t border-gray-100">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-gray-600">
                      Volume deste exercício:
                    </Text>
                    <Text className="text-sm font-medium text-gray-900">
                      {`${exerciseData.sets
                        .reduce((total, set) => {
                          /* prettier-ignore */
                          return total + ((set.weight || 0) * (set.reps || 0));
                        }, 0)
                        .toLocaleString()} ${exerciseData.sets[0]?.weightUnit || "lbs"}`}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
