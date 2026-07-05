import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { client } from "@/lib/sanity/client";
import { Exercise } from "@/lib/sanity/types";
import ExerciseCard from "@/app/components/ExerciseCard";
import { defineQuery } from "groq";

//Define the query outsite the component for proper type generation
export const exercisesQuery = defineQuery(
  `*[_type == "exercise"] | order(name asc) {
    ...
  }`,
);

export default function Exercices() {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const fetchExercises = async () => {
    try {
      // Fetch exercises from Sanity
      const exercises = await client.fetch(exercisesQuery);
      setExercises(exercises);
      setFilteredExercises(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      // You could add error handling here, like showing a toast
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    const filtered = exercises.filter((exercise: Exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredExercises(filtered);
  }, [searchQuery, exercises]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold Otext-gray-900">
          Biblioteca de Exercícios
        </Text>
        <Text className="Otext-gray-600 mt-1">
          Descubra e domine novos exercícios
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-1 mt-4">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 Otext-gray-800"
            placeholder="Buscar exercícios ... "
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Exercises List */}
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 24 }}
          className="mb-16"
          renderItem={({ item }) => (
            <ExerciseCard
              item={item}
              onPress={() => router.push(`/exercise-detail?id=${item._id}`)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3B82F6"]} // Android
              tintColor="#3B82F6" // i0S
              title="Puxe para atualizar os exercícios" // i0S
              titleColor="#6B7280" // i0S
            />
          }
          ListEmptyComponent={
            <View className="bg-white rounded-2xl p-8 items-center">
              <Ionicons name="fitness-outline" size={64} color="#9CA3AF" />
              <Text className="text-xl font-semibold Otext-gray-900 mt-4">
                {searchQuery
                  ? "Nenhum exercício encontrado"
                  : "Carregando exercícios ... "}
              </Text>
              <Text className="Otext-gray-600 text-center mt-2">
                {searchQuery
                  ? "Tente ajustar sua pesquisa."
                  : "Seus exercícios aparecerão aqui."}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
