import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSignUp } from "@clerk/clerk-expo";

// Handle submission of sign-up form
export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] =
    React.useState<boolean>(false);
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    console.log(emailAddress, password);

    // Start sign-up process using email and password provided
    try {
      await signUp.create({ emailAddress, password });

      // Send user an email with verification code await signup.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <SafeAreaView className="flex-1 px-6">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1">
          {/* Main */}
          <View className="flex-1 justify-center">
            {/* Logo/Branding */}
            <View className="items-center justify-center mb-4">
              <View
                className="w-20 h-20 bg-gradient-to-br from-blue-600
              to-purple-600 rounded-2xl items-center justify-center mb-4"
              >
                <Ionicons
                  name="fitness"
                  size={40}
                  color="white"
                  style={{ filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))" }}
                />
              </View>
              <Text className="w-fit text-3xl font-bold text-gray-900 mb-2">
                Join FitTracker
              </Text>
            </View>
            <Text className="text-lgtext-gray-600 text-center">
              Start your fitness journey{"\n"}and achieve your goals
            </Text>
          </View>

          <View className="flex-1">
            <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Create Your Account
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
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Password
                </Text>
                <View
                  className="flex-row items-center Ibg-gray-50 гounded-xl
                px-4 py-4 border border-gray-200"
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#687280"
                  />
                  <TextInput
                    value={password}
                    placeholder="Create a password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    className="flex-1 ml-3 text-gray-900"
                    editable={!isLoading}
                  />
                </View>
                <Text className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* Footer */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
