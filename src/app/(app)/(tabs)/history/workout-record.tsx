import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
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
  const [deleting, setDeleting] = useState<boolean>(true);
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
        console.log("Result:", result.date);
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

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      hour: "numeric",
      minute: "2-digit",
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
      exercise.sets.forEach((set) => {
        if (set.weight && set.reps) {
          totalVolume += set.weight * set.reps;
          unit = set.weightUnit || "libs";
        }
      });
    });

    return { volume: totalVolume, unit };
  };

  if (loading)
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Carregando treino...</Text>
      </View>
    </SafeAreaView>;

  if (!workout)
    <SafeAreaView>
      <View className="flex-1 items-center justify-center">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-xl font-semibold Otext-gray-900 mt-4">
          Treino não encontrado!
        </Text>
        <Text className="Otext-gray-600 text-center mt-2">
          Este registro de treino não foi encontrado.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="Dbg-blue-600 px-6 py-3 rounded-lg mt-6"
        >
          <Text className="text-white font-medium">Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>;

  const { volume, unit } = getTotalVolume();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Workout Summary */}
        <View className="bg-white px-6 border-b border-gray-300">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold Otext-gray-900">
              Resumo do Treino
            </Text>
            <TouchableOpacity
              // onPress={handleDeleteWorkout}
              disabled={deleting}
              className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center"
            >
              {!deleting ? (
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
            <Text className="Otext-gray-700 ml-3 font-medium">
              {formatDate(workout?.date)} às {formatTime(workout?.date)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
