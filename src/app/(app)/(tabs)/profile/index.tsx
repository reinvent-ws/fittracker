import { GetWorkoutsQueryResult } from "@/lib/sanity/types";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Text, TouchableOpacity, View } from "react-native";
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

  return (
    <SafeAreaView className="flex-1 px-4 flex-row justify-between">
      <Text>Profile</Text>

      {/* Sign Out */}
      <View className="">
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-red-600 rounded-2xl px-4 py-1 shadow-sm"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">Sair</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
