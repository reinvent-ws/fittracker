import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSSO } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser fro Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      //Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function GoogleSignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass aschem, like AuthSession.makeRedirectUri({ sheme, path })
          // Fore more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessonmakeredirecurioptions
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // If there is no `createSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSS0Flow`
        // to handle next steps
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      className={`rounded-xl py-4 shadow-xs my-2 ${
        isLoading ? "bg-gray-400" : "bg-white border border-gray-200 shadow-sm"
      }`}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-center">
        <Image
          source={{
            uri: "https://developers.google.com/static/identity/images/g-logo.png",
          }}
          style={{ width: 24, height: 24 }}
        />
        <Text
          className={`${!isLoading ? "text-gray-500" : "text-white"} font-semibold text-lg ml-3`}
        >
          {isLoading ? "Signing In Google..." : "Continue with Google"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
