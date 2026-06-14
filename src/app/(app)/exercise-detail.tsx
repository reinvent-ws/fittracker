import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import { client, urlFor } from "@/lib/sanity/client";
import { Exercise } from "sanity/sanity.types";
import { Ionicons } from "@expo/vector-icons";
import { getDifficulty } from "@/utils";

export default function ExerciseDetail() {
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise>();
  const [loading, setLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiGuidance, setAiGuidance] = useState<boolean>(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const singleExerciseQuery = defineQuery(
    `*[_type == "exercise" && _id == $id][0]`,
  );

  const fetchId = async () => {
    try {
      if (!id) return;

      const exerciseData = await client.fetch(singleExerciseQuery, { id });
      setLoading(true);
      setExercise(exerciseData);
    } catch (error) {
      console.error("Error fetching id exercise: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchId();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="Itext-gray-500">Carregando seu exercício...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-center">
            Exercício não foi encontrado: {id}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 bg-blue-500 px-6 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getAiGulidance = () => {};

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header with close button */}
      <View className="absolute top-12 right-0 z-10 px-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-8 h-8 bg-black/20  rounded-full items center justify-center items-center backdrop-blur-sm"
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 h-full"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View className="h-40 bg-white relative px-6">
          {exercise?.imageUrl ? (
            <Image
              source={{ uri: urlFor(exercise.imageUrl.asset._ref).url() }}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <View className="h-40 gap-4 justify-center items-center">
              <Ionicons
                name="fitness"
                size={40}
                color="white"
                style={{ filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))" }}
              />
            </View>
          )}

          {/* Content */}
          <View className="py-6">
            {/* Title and difficulty */}
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1 mr-4">
                <Text className="text-3xl font-bold text-gray-800 mb-2">
                  {exercise?.name}
                </Text>
                <View
                  className={`self-start px-4 py-2 rounded-full ${getDifficulty(exercise?.difficulty).color}`}
                >
                  <Text className="text-sm font-semibold text-white">
                    {getDifficulty(exercise?.difficulty).title}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-xl font-semibold Otext-gray-800 mb-3">
              Descrição do exercício
            </Text>
            <Text className="Otext-gray-600 leading-6 text-base">
              {exercise?.description ||
                "No description available for this exercise."}
            </Text>
          </View>

          {/* Video section */}
          {exercise?.videoUrl && (
            <View className="mb-6">
              <Text className="text-xl font-semibold Otext-gray-800 mb-3">
                Video Tutorial
              </Text>
              <TouchableOpacity
                className="bg-red-500 rounded-xl p-4 flex-row items-center"
                onPress={() => Linking.openURL(exercise?.videoUrl)}
              >
                <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4">
                  <Ionicons name="play" size={20} color="#EF4444" />
                </View>
                <View>
                  <Text className="text-white font-semibold text-lg">
                    Assista ao tutorial
                  </Text>
                  <Text className="text-red-100 text-sm">
                    Aprenda a postura correta
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* TODO: AI Guidance */}

          {/* ----------------- */}

          {/* Action Buttons */}

          <View className="mt-8 gap-2">
            {/* AI Coach Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${
                aiLoading
                  ? "bg-gray-400"
                  : aiGuidance
                    ? "bg-green-500"
                    : "Dbg-blue-500"
              }`}
              onPress={getAiGulidance}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Loading ...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-lg">
                  {aiGuidance
                    ? "Refresh AI Guidance"
                    : "Get AI Guidance on Form & Technique"}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 rounded-xl py-4 items-center"
              onPress={() => router.back()}
            >
              <Text className="text-gray-800 font-bold text-lg">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
