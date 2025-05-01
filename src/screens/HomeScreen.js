import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    if (firstName && lastName && username) {
      if (username.toLowerCase().endsWith("villanova.edu")) {
        try {
          const email = username.toLowerCase();

          // Save user info to Firestore
          const userRef = doc(db, "users", email);
          await setDoc(userRef, {
            fullName: `${firstName} ${lastName}`,
            email,
            profilePic: null,
            answers: null,
            createdAt: Date.now(),
          });

          // Navigate with email to QuestionnaireScreen
          Alert.alert("Welcome", `Hi, ${firstName}!`, [
            {
              text: "Continue",
              onPress: () => navigation.replace("HomeTabs", {
                screen: "Questionnaire",
                params: { email },
              }),
            },
          ]);
          
        } catch (error) {
          console.error("Firestore error:", error);
          Alert.alert("Error", "Failed to save user info.");
        }
      } else {
        Alert.alert("Invalid Email", "Please provide a valid Villanova email!");
      }
    } else {
      Alert.alert("Missing Info", "Please fill out all fields!");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Let's Get Started</Text>
        <Text style={styles.subtitle}>Enter your details to continue</Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="person-circle-outline" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your Villanova Email"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#aaa"
          />
        </View>

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
    backgroundColor: '#f9fafb',
    paddingTop: 60,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

