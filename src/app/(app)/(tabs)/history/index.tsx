import { client } from "@/lib/sanity/client";
import { GetWorkoutsQueryResult, Workout } from "@/lib/sanity/types";
import { formatDate, formatDuration } from "@/utils";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const getWorkoutsQuery = defineQuery(`
  *[_type == "workout"] | order(date desc) {
    _id,
    date,
    duration,
    exercises[] {
      _key,
      _type,
      exercise-> {
        _id,
        name
      },
      sets[] {
        reps,
        weight,
        weightUnit,
        _type,
        _key
      }
    },
    _type,
    _key
  }
`);

export default function HistoryPage() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<Workout[] | any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const router = useRouter();

  const fetchWorkouts = async () => {
    try {
      const result = await client.fetch(getWorkoutsQuery);
      setWorkouts(result);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
  };

  const getExerciseNames = (workout: Workout) => {
    return (
      workout.exercises?.map((e: any) => e.exercise?.name).filter(Boolean) || []
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="py-6 border-b border-gray-200 mb-4">
          <Text className="text-2xl font-bold text-gray-900">
            Histórico de Treinos
          </Text>
          <Text className="text-gray-600 mt-1">
            {workouts.length}{" "}
            {workouts.length === 1
              ? "treino completado"
              : "treinos completados"}
          </Text>
        </View>

        {/* Workout List */}
        {workouts.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Ionicons name="barbell-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-4 text-center">
              Nenhum treino registrado ainda.
            </Text>
          </View>
        ) : (
          <View className="space-y-4 gap-4 mb-8">
            {workouts.map((workout: any) => (
              <TouchableOpacity
                key={workout._id}
                onPress={() =>
                  router.push(
                    `/(tabs)/history/workout-record?workoutId=${workout._id}`,
                  )
                }
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-col"
              >
                {/* Date & Time */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#4B5563"
                    />
                    <Text className="text-gray-900 font-semibold ml-2">
                      {formatDate(workout.date)}
                    </Text>
                    '
                  </View>
                  <View className="bg-blue-50 rounded-full p-2">
                    <Ionicons name="time-outline" size={20} color="#3b82f6" />
                  </View>
                </View>

                {/* Stats */}
                <View className="flex-row items-center space-x-4 gap-4 mb-4">
                  <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-1.5">
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-700 text-sm font-medium ml-1.5">
                      {formatDuration(workout.duration)}
                    </Text>
                  </View>

                  <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-1.5">
                    <Ionicons
                      name="fitness-outline"
                      size={16}
                      color="#6B7280"
                    />
                    <Text className="text-gray-700 text-sm font-medium ml-1.5">
                      {workout.exercises?.length || 0} exercícios
                    </Text>
                  </View>
                </View>

                {/* Exercise List */}
                {workout.exercises && workout.exercises.length > 0 && (
                  <View>
                    {/* CORRIGIDO: text-gray-700 */}
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Exercícios:
                    </Text>
                    <View className="flex-row flex-wrap">
                      {getExerciseNames(workout)
                        .slice(0, 3)
                        .map((name, index) => (
                          <View
                            key={index}
                            className="bg-blue-50 rounded-lg px-3 py-1 mr-2 mb-2"
                          >
                            {/* CORRIGIDO: text-blue-700 */}
                            <Text className="text-blue-700 text-sm font-medium">
                              {name}
                            </Text>
                          </View>
                        ))}
                      {getExerciseNames(workout).length > 3 && (
                        <View className="bg-gray-100 rounded-lg px-3 py-1 mr-2 mb-2">
                          {/* CORRIGIDO: text-gray-600 */}
                          <Text className="text-gray-600 text-sm font-medium">
                            +{getExerciseNames(workout).length - 3} more
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
