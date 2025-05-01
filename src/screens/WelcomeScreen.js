import { View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { useColorScheme } from "nativewind";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ArrowUpRightIcon } from "react-native-heroicons/outline"
import { useNavigation } from '@react-navigation/native';
import HomeScreen from './HomeScreen';


export default function WelcomeScreen() {

    const navigation = useNavigation();

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
        <View onLayout = {onLayoutRootView} style = {{ flex: 1, width: wp(100) }}>
            <View style = {{justifyContent: 'center', alignItems: 'center', width: wp(100), height: hp(100) }} >
                {/*Image */}
                <View style = {{paddingTop: 1, justifyContent:'center', alignItems: 'center', marginVertical: 4, width: wp(100) }}>
                    <Image
                        source = {require("../../assets/villanova_wildcats.png")}
                        style = {{width: wp(100), height: hp(48), resizeMode: "cover"}}
                    />
                </View>

                {/*Welcome Text*/}
                <View style = {{width: '100%', padding: 6, paddingHorizontal: 10}}>
                    <Text style = {{fontSize: wp(10), fontFamily: "SpaceGroteskBold", fontWeight: '600', letterSpacing: 2, lineHeight: 0}}>
                        Villanova University
                    </Text>
                    <Text style = {{fontSize: wp(10), fontFamily: "SpaceGroteskBold", letterSpacing: 2, lineHeight: 0, width: '70%'}} >
                        Find a Friend
                    </Text>
                    <Text style = {{fontSize: wp(4), color: '#4A4A4A', lineHeight: 24, letterSpacing: 1, width: '70%', marginTop: 8}}>
                        App that allows you to find a friend at Nova!
                    </Text>
                </View>

                <View style = {{width: '100%', paddingHorizontal: 10}}>
                    <TouchableOpacity
                        style = {{backgroundColor: '#2563EB', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 16, width: '45%', alignItems: 'center'}}
                        onPress={() => navigation.navigate("Home")}
                    >
                        <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style = {{fontSize: wp(3.5), fontFamily: "SpaceGroteskMedium", fontWeight: '700', color: 'white', marginRight: 8}}>
                                Get Started
                            </Text>
                            <ArrowUpRightIcon color={"white"} size={20} strokeWidth={2.5} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
