import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          headerShown: false,
          title:"Home",
          tabBarIcon: ({color, size}) => (
            <AntDesign name='home' color={color} size={size}/>
          )
        }}
      />
      <Tabs.Screen
        name='exercices'
        options={{
          title:"Exercices",
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <AntDesign name='book' color={color} size={size}/>
          )
        }}
      />
      <Tabs.Screen
        name='workout'
        options={{
          title:"Workout",
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <AntDesign name='plus-circle' color={color} size={size}/>
          )
        }}
      />
      <Tabs.Screen
        name='active-workout'
        options={{
          title:"Active Workout",
          headerShown: false,
          href: null,
          tabBarStyle: {
              display: 'none'
          }
        }}
      />
      <Tabs.Screen
        name='history'
        options={{
          title:"History",
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <AntDesign name='clock-circle' color={color} size={size}/>
          )
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          headerShown: false,
          title:"Profile",
          tabBarIcon: ({color, size}) => (
            <AntDesign name='user' color={color} size={size}/>
          )
        }}
      />
    </Tabs>
  )
}
