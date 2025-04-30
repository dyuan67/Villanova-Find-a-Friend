import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WelcomeScreen from "../screens/WelcomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import QuestionnaireScreen from "../screens/QuestionnaireScreen";
import MatchesScreen from "../screens/MatchesScreen";
import HomeScreen from "../screens/HomeScreen";
import { Ionicons } from "@expo/vector-icons";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigation() {

    const HomeTabs = () => {
        return (
            <Tab.Navigator 
                screenOptions={({route}) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        let iconName;
                        if (route.name === "Home") {
                            iconName = "home";
                          } else if (route.name === "Matches") {
                            iconName = "happy-outline";
                          } else if (route.name === "Profile") {
                            iconName = "person-outline";
                          } else if (route.name === "Questionnaire") {
                            iconName = "chatbubbles-outline";
                          }
              
                          const customizeSize = 25;
                        
                          return (
                            <Ionicons
                                name={iconName}
                                size={customizeSize}
                                color={focused ? "#3B82F6" : "gray"}
                            />
                          );
                    },

                    tabBarActiveTintColor: "#3B82F6",
                    tabBarLabelStyle: {
                        fontWeight: "bold",
                    },
                    tabBarInactiveTintColor: "gray",
                    // tabBarShowLabel: false,
                    tabBarStyle: {
                     },
                })}
            >
                
                <Tab.Screen name = "Profile" component = {ProfileScreen} />
                <Tab.Screen name = "Questionnaire" component = {QuestionnaireScreen} />
                <Tab.Screen name = "Matches" component = {MatchesScreen} />
            </Tab.Navigator>
        );
    };
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName = "Welcome"
            screenOptions={{ headerShown: false}}>

                <Stack.Screen name = "Welcome" component = {WelcomeScreen} />
                <Stack.Screen name = "Matches" 
                    component = {MatchesScreen} 
                    options = {{presentation : "modal",}}
                />
                <Stack.Screen name = "HomeTabs" component = {HomeTabs} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}