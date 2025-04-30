import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ArrowUpRightIcon } from "react-native-heroicons/outline"
import { useNavigation } from '@react-navigation/native';



export default function HomeScreen() {
    const navigation = useNavigation();

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
                <View className = "rounded-fill items-center justify-center"></View>
                <Image 
                    source = {require('../../assets/images/profile.jpeg')}
                    style = {{
                        width: hp(4.5),
                        height: hp(4.5),
                        resizeMode: "cover",
                    }}
                    className = "rounded-full"
                />
            </View>

            {/* Brand name */}
            <View>
                <Text className = "text-xl font-semibold text-center uppercase">
                    Find a Friend
                </Text>
            </View>

            {/* Bell Icon */}
            <View className = "bg-black/10 p-2 rounded-full itemns-center justify-center">
            </View>
            <Text>HomeScreen</Text>

            <View style = {{width: '100%', paddingHorizontal: 10}}>
                    <TouchableOpacity
                        style = {{backgroundColor: '#2563EB', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 16, width: '45%', alignItems: 'center'}}
                        onPress={() => navigation.replace("HomeTabs")}
                    >
                        <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style = {{fontSize: wp(3.5), fontFamily: "SpaceGroteskMedium", fontWeight: '700', color: 'white', marginRight: 8}}>
                                Get Started
                            </Text>
                            <ArrowUpRightIcon color={"white"} size={20} strokeWidth={2.5} />
                        </View>
                    </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}