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
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name = "Welcome" component = {WelcomeScreen} />
                <Stack.Screen name = "Home" component = {HomeScreen} />
                <Stack.Screen name = "Profile" component = {ProfileScreen} />
                <Stack.Screen name = "Questionnaire" component = {QuestionnaireScreen} />
                <Stack.Screen name = "Matches" component = {MatchesScreen} />



            </Stack.Navigator>
        </NavigationContainer>
    )
}