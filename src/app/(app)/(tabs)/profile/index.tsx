import { GetWorkoutsQueryResult } from "@/lib/sanity/types";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { defineQuery } from "groq";
import { client } from "@/lib/sanity/client";

export const getWorkoutsQuery =
  defineQuery(`*[_type == "workout" && userId == $userId] | order(date desc){
    _id,
    date,
    duration,
    exercises[] {
      exercise -> {
        _id,
        name
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

export default function ProfilePage() {
  const { signOut } = useAuth();
  const [workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchWorkouts = async () => {
    if (!user?.id) return;

    try {
      const results = await client.fetch(getWorkoutsQuery, { userId: user.id });
      setWorkouts(results);
    } catch (error) {
      console.error("Error fethcing workouts: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id]);

  // Calculate stats
  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce(
    (sum, workout) => sum + (workout.duration || 0),
    0,
  );
  const averageDuration =
    totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

  // Calculate days since joining (using createdAt from Clerk)
  const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date();
  const daysSinceJoining = Math.floor(
    (new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleSignOut = () => {
    Alert.alert("Sair da conta", "Tem certeza de que deseja sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-600 mt-4">Carregando o perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 flex-row justify-between">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-8 pb-6">
          <Text className="text-3xl font-bold text-gray-900">Perfil</Text>
          <Text className="text-lg text-gray-900">
            Gerencie sua conta e suas estatísticas.
          </Text>
        </View>

        {/* Sign Out */}
        <View className="">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-600 rounded-2xl px-4 py-1 shadow-sm"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Sair
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
