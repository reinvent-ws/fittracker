import { View, Text, Modal } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useWorkoutStore } from "store/workout-store";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ExerciseSelectionModal({
  visible,
  onClose,
}: ModalProps) {
  const router = useRouter();
  const { addExerciseToWorkout } = useWorkoutStore();
  const [exercises, setExercises] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      className="bg-orange-400 flex-1"
    >
      <Text>ExerciseSelectionModal</Text>
    </Modal>
  );
}
