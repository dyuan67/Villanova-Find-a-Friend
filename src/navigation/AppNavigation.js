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


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigation() {

    const HomeTabs = () => {
        return (
            <Tab.Navigator>
                <Tab.Screen name = "Home" component = {HomeScreen} />
                <Tab.Screen name = "Profile" component = {ProfileScreen} />
                <Tab.Screen name = "Questionnaire" component = {QuestionnaireScreen} />
            </Tab.Navigator>
        );
    };
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName = "Welcome">

                <Stack.Screen name = "Welcome" component = {WelcomeScreen} />
                <Stack.Screen name = "Matches" 
                    component = {MatchesScreen} 
                    options = {{presentation : "modal",}}
                />
                <Stack.Screen name = "Home" component = {HomeTabs} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}