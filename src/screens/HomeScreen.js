import { View, Text, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {profile} from "../../assets/images/profile.jpeg"

export default function HomeScreen() {
    return (
        <SafeAreaView 
        edges = {['top', 'left', 'right']}
        className = "bg-white flex-1 justify-between"
        style = {{
            paddingTop: hp(2)
        }}
        >
            {/* Header */}
            <View className = "w-full flex-row justify-between items-center px-4 mb-8">
                {/* Image */}
                <View classname = "rounded-fill items-center justify-center"></View>
                <Image 
                    source = {profile}
                    style = {{
                        width: hp(4.5),
                        height: hp(4.5),
                        resizeMode: "cover",
                    }}
                    className = "rounded-full"
                />
            </View>

            <Text>HomeScreen</Text>
        </SafeAreaView>
    );
}