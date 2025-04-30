import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ArrowUpRightIcon } from "react-native-heroicons/outline"
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';



export default function HomeScreen() {
    const navigation = useNavigation();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');

    const handleLogin = () => {
        if (firstName && lastName && username) {
            Alert.alert("Login Successful", `Welcome, ${firstName}!`, [
                { text: "OK", onPress: () => navigation.replace("HomeTabs") },
            ]);
        } else {
            Alert.alert("Error", "Please fill in all fields!");
        }
    };

    return (
        <SafeAreaView style = {styles.safeArea}>
        <View style = {StyleSheet.container}>
            <Text style={StyleSheet.title}>Please Enter Your Login Information</Text>

            {/* First Name Input */}
            <TextInput
                style={styles.input}
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
            />

            {/* Last Name Input */}
            <TextInput
                style={styles.input}
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
            />

            {/* Username Input */}
            <TextInput
                style={styles.input}
                placeholder="Enter your Villanova Email"
                value={username}
                onChangeText={setUsername}
            />

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingTop: 60,
      },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f8f8f8',
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    button: {
        width: '100%',
        paddingVertical: 15,
        backgroundColor: '#2563EB',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});