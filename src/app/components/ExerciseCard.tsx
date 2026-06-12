import { Exercise } from "@/lib/sanity/types";
import { View, Text, TouchableOpacity } from "react-native";

// const getDifficultyColor = (difficulty: string) => {
//   switch (difficulty) {
//     case "beginner":
//       return "bg-green-500";
//     case "intermediate":
//       return "bg-yellow-500";
//     case "advanced":
//       return "bg-red-500";
//     default:
//       return "bg-gray-500";
//   }
// };

// const getDifficultyText = (difficulty: string) => {
//   switch (difficulty) {
//     case "beginner":
//       return "Beginner";
//     case "intermediate":
//       return "Intermediate";
//     case "advanced":
//       return "Advanced";
//     default:
//       return "Unknown";
//   }
// };

const getDifficulty = (
  difficulty: string,
): { color: string; title: string } => {
  switch (difficulty) {
    case "beginner":
      return { color: "bg-green-500", title: "Beginner" };
    case "intermediate":
      return { color: "bg-yellow-500", title: "Intermediate" };
    case "advanced":
      return { color: "bg-red-500", title: "Advanced" };
    default:
      return { color: "bg-gray-500", title: "Unknown" };
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
      className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100"
    >
      <View className="text-black">
        <Text>{item.name}</Text>
        <Text>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
}
