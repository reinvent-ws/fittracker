import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image, ImageSourcePropType } from "react-native";
import { useUser } from "@clerk/clerk-expo";

export default function Layout() {
  const { user } = useUser();
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Inicial",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="exercices"
        options={{
          title: "Exercícios",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="bars" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Treino",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="plus-circle" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="active-workout"
        options={{
          title: "Treino Ativo",
          headerShown: false,
          href: null,
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Histórico",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="clock-circle" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={{
                uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
              }}
              className="rounded-full"
              style={{ width: 28, height: 28, borderRadius: 100 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
