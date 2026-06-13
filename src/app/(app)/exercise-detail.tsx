import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { defineQuery } from "groq";
import { client, urlFor } from "@/lib/sanity/client";
import { Exercise } from "sanity/sanity.types";

const { id } = useLocalSearchParams<{ id: string }>();

export const itemQuery = defineQuery(
  `*[_type == "exercise" && _id == ${id}] {
        ...
    }`,
);

export default function ExerciseDetail() {
  const [exercise, setExercise] = useState<Exercise>();

  const fetchExercises = async () => {
    try {
      const _idExercises = await client.fetch(itemQuery);
      setExercise(_idExercises);
    } catch (error) {}
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Image source={{ uri: urlFor(exercise.imageUrl?.asset?._ref).url() }} />
      <Text>Detalhe do exercício: {exercise.name}</Text>
    </SafeAreaView>
  );
}
