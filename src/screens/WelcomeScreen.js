import { View, Text } from 'react-native';
import React from 'react';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";


export default function WelcomeScreen() {
    const [fontsLoaded, fontError] = useFonts({
        SpaceGroteskSemiBold: require("../font/SpaceGrotesk-SemiBold.ttf"),
        SpaceGroteskBold: require("../font/SpaceGrotesk-Bold.ttf"),
        SpaceGroteskMedium: require("../font/SpaceGrotesk-Medium.ttf"),
      });

      const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
      }, [fontsLoaded, fontError]);

      if (!fontsLoaded) {
        return null;
      }

    return (
        <View onLayout = {onLayoutRootView}>
            <Text>WelcomeScreen</Text>
        </View>
    )
}