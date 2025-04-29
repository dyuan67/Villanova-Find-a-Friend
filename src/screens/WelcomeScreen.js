import { View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ArrowUpRightIcon } from "react-native-heroicons/outline"


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
        <View onLayout = {onLayoutRootView}
            className = "flex-1"
            style = {{
                width: wp(100),
            }}
         >
            <View className = "justify-center items-center"
                style = {{
                    width: wp(100),
                    height: hp(100),
                }}
            >
                {/*Image */}
                <View className = "justify-center items-center my-4"
                    style = {{
                        width: wp(100),
                    }}
                >
                    <Image
                        source={require("../../assets/villanova_wildcats.png")}
                        style={{
                            width: wp(100),
                            height: hp(40),
                            resizeMode: "cover",
                        }}
                    />
                </View>

                {/*Welcome Text*/}
                <View className = "w-full p-6 px-10">
                    <Text className = "font-semibold  tracking-widest leading-none"
                        style = {{
                            fontSize: wp(10),
                            fontFamily: "SpaceGroteskBold"
                        }}
                    >
                        blah blah blah
                    </Text>
                    
                    <Text className = "tracking-widest w-[70%] leading-none"
                        style={{
                            fontSize: wp(10),
                            fontFamily: "SpaceGroteskBold"
                        }}
                    >
                        Trial Run
                    </Text>

                    <Text className="text-gray-800 leading-6 tracking-wider w-[70%] mt-2"
                        style={{
                            fontSize: wp(4),
                        }}
                    >
                        Words Words Words Words Words Words Words Words Words Words
                    </Text>
                </View>

                <View className="w-full px-10">
                    <TouchableOpacity className = "bg-blue-600 px-4 py-4 rounded-x1 flex-row justify-center items-center w-[45%]">
                        <Text className = "text-white font-bold mr-2"
                            style = {{
                                fontSize: wp(3.5),
                                fontFamily: "SpaceGroteskMedium"
                            }}
                        >
                            Get Started
                        </Text>
                        <ArrowUpRightIcon color = {"white"} size = {20} strokeWidth = {2.5} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}