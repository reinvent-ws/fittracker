import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Workout() {
  const router = useRouter();

  const startWorkout = () => {
    // Navigate to active workout screen
    router.push("/active-workout");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Main Start Workout Screen */}
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="pt-8 pb-6">
          <Text className="text-3xl font-bold Otext-gray-900 mb-2">
            Pronto para o treino?
          </Text>
          <Text className="text-lg Otext-gray-600">
            Cada treino é um passo mais perto da sua meta.
          </Text>
        </View>

        {/* Generic Start Workout Card */}
      </View>
      <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mx-6 mb-8">
        <View className="flex-row items-start justify-between mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="fitness" size={24} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-xl font-semibold Otext-gray-900">
                Bora treinar
              </Text>
              <Text className="Itext-gray-500">
                Tudo preparado para sua evolução.
              </Text>
            </View>
          </View>
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 font-medium text-sm">Pronto!</Text>
          </View>
        </View>
        {/* Start Button */}
        <TouchableOpacity
          onPress={startWorkout}
          className="bg-blue-600 rounded-2xl py-4 items-center active:bg-blue-700"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="play"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold text-lg">
              Iniciar treino
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
