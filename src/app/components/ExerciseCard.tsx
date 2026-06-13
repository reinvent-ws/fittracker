import { urlFor } from "@/lib/sanity/client";
import { Exercise } from "@/lib/sanity/types";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Image } from "react-native";

const getDifficulty = (
  difficulty: string,
): { color: string; title: string } => {
  switch (difficulty) {
    case "beginner":
      return { color: "bg-green-400", title: "Iniciante" };
    case "intermediate":
      return { color: "bg-yellow-400", title: "Intermediário" };
    case "advanced":
      return { color: "bg-red-400", title: "Avançado" };
    default:
      return { color: "bg-gray-400", title: "Desconhecido" };
  }
};

type ExerciseCardProps = {
  item: Exercise;
  onPress: () => void;
  showChevron?: boolean;
};

export default function ExerciseCard({
  item,
  onPress,
  showChevron = false,
}: ExerciseCardProps) {
  return (
    <TouchableOpacity
      key={item._id}
      onPress={onPress}
      className="bg-gray-50 rounded-2xl mb-4 shadow border border-gray-100"
    >
      <View className="flex-row w-fit p-2 items-center">
        {item.imageUrl ? (
          <>
            <View className="w-14 h-14 rounded-xl mr-4 overflow-hidden">
              <Image
                source={{ uri: urlFor(item.imageUrl?.asset?._ref).url() }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1 justify-between gap-4">
              <View className="flex-row items-center">
                <Text className="flex-1 font-bold">{item.name}</Text>
                <Text
                  className={`${getDifficulty(item.difficulty).color} rounded-full px-2 py-[2px] text-[11px] text-white`}
                >
                  {getDifficulty(item.difficulty).title}
                </Text>
              </View>
              <Text className={`text-[11px] text-gray-600`} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </>
        ) : (
          <View
            className="w-full h-full bg-gradient-to-br from-blue-400
Oto-purple-500 items-center justify-center"
          >
            <Ionicons name="fitness" size={24} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
