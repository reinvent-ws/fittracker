import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import GoogleSignIn from "../components/GoogleSignIn";
// import { useSignIn } from '@clerk/clerk-expo'

export default function SignInScreen() {
  // const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    // if (!isLoaded) return
    // // Start the sign-in process using the email and password provided
    // try{
    //     const signInAttempt = await signIn.create({
    //         identifier: emailAddress,
    //         password,
    //     })
    //     // If sign-in process is complete, set the created session as active
    //     // and redirect the user
    //     if (signInAttempt.status === 'complete') {
    //         await setActive({ session: signInAttempt.createdSessionId });
    //         router.replace('/');
    //     } else {
    //         // If the status isn't complete, check why. User might need to
    //         // complete furher steps.
    //         console.error(JSON.stringify(signInAttempt, null, 2))
    //     }
    // }
    // catch(err){
    //     console.log(JSON.stringify(err, null, 2))
    // }
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 p-6">
          {/* Header section */}
          <View className="justify-center">
            {/* Logo/Branding */}
            <View className="items-center mb-8">
              <View className="flex-row w-fit h-fit items-center gap-4 mb-4">
                <Ionicons
                  name="fitness"
                  size={40}
                  color="white"
                  style={{ filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))" }}
                />
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                  FitTracker
                </Text>
              </View>
              <Text className="text-lg text-gray-600 text-center">
                Track your fitness journey{"\n"}and reach your goals
              </Text>
            </View>
          </View>

          {/* Sign in section */}
          <View className="flex-1 justify-center">
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Welcome Back
              </Text>

              {/* Email Input */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Email
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-0 border border-gray-200">
                  <Ionicons name="mail-outline" size={20} color="#6B7280" />
                  <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={true}
                    onChangeText={setEmailAddress}
                    className="flex-1 ml-3 text-gray-900"
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="my-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Password
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-0 border border-gray-200">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#6B7280"
                  />
                  <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    className="flex-1 ml-3 text-gray-900"
                    editable={!isLoading}
                  />
                </View>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={onSignInPress}
              disabled={isLoading}
              className={`rounded-xl py-4 shadow-sm mb-4 ${
                isLoading ? "bg-gray-400" : "bg-blue-600"
              }`}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <Ionicons name="refresh" size={20} color="white" />
                ) : (
                  <Ionicons name="log-in-outline" size={20} color="white" />
                )}
                <Text className="text-white font-semibold text-lg ml-2">
                  {isLoading ? "Signing In..." : "Sign In"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-2">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="px-4 text-gray-500 text-sm">or</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Google Sign in Button */}
            <GoogleSignIn />

            {/*Sign Up Link */}
            <View className="flex-row justify-center items-center gap-2">
              <Text className="text-gray-600">Don't have an account?</Text>
              <Link href={"/sign-up"} asChild>
                <TouchableOpacity>
                  <Text className="text-bue-600 font-semibold">Sign-up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Footer section */}
          <View className="justify-end">
            <Text className="text-center text-gray-500 text-sm">
              Start your fitness journey today.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
