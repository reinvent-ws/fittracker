import { Stack } from "expo-router";
import { StackScreen } from "react-native-screens";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="workout-record"
        options={{
          headerTitle: "Treino Registrado",
          headerShadowVisible: true,
        }}
      />
    </Stack>
  );
}
