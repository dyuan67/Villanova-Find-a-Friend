import { View, Text, Button, Image, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

export default function ProfileScreen({ route }) {
  // Destructure name and email directly from route.params
  const { fullName, email } = route.params;

  const [image, setImage] = useState(null);
  const [hobbies, setHobbies] = useState('');
  const [music, setMusic] = useState('');
  const [talent, setTalent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert('Please upload an image.');
      return;
    }
  
    try {
      const updatedFields = {
        ...(hobbies && { hobbies }),
        ...(talent && { hiddenTalent: talent }),
        ...(music && { favoriteSong: music }),
        profilePic: image,
      };
  
      await setDoc(doc(db, 'users', email), updatedFields, { merge: true });
  
      setSubmitted(true);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Something went wrong while saving.");
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {submitted ? (
        <View style={styles.profileContainer}>
          {image && <Image source={{ uri: image }} style={styles.profileImage} />}
          {fullName !== '' && <Text style={styles.profileText}>Name: {fullName}</Text>}
          {email !== '' && <Text style={styles.profileText}>Email: {email}</Text>}
          {hobbies !== '' && <Text style={styles.profileText}>Hobbies: {hobbies}</Text>}
          {music !== '' && <Text style={styles.profileText}>Favorite Song: {music}</Text>}
          {talent !== '' && <Text style={styles.profileText}>Hidden Talent: {talent}</Text>}
          <Button title="Edit" onPress={() => setSubmitted(false)} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.form}>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <Text style={styles.imageText}>Tap to upload image</Text>
              )}
            </TouchableOpacity>

            {/* Displaying the passed name and email */}
            <Text style={styles.input}>{fullName}</Text>
            <Text style={styles.input}>{email}</Text>

            {/* Hobbies Input */}
            <View style={styles.inputWithIcon}>
              <Ionicons name="color-palette-outline" size={20} color="#666" style={styles.icon} />
              <TextInput
                placeholder="Hobbies"
                value={hobbies}
                onChangeText={setHobbies}
                style={styles.inputFlex}
              />
            </View>

            {/* Favorite Song Input */}
            <View style={styles.inputWithIcon}>
              <Ionicons name="musical-notes-outline" size={20} color="#666" style={styles.icon} />
              <TextInput
                placeholder="Favorite Song"
                value={music}
                onChangeText={setMusic}
                style={styles.inputFlex}
              />
            </View>

            {/* Hidden Talent Input */}
            <View style={styles.inputWithIcon}>
              <Ionicons name="sparkles-outline" size={20} color="#666" style={styles.icon} />
              <TextInput
                placeholder="What is your Hidden Talent"
                value={talent}
                onChangeText={setTalent}
                style={styles.inputFlex}
              />
            </View>

            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 120,
    alignItems: 'center',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  imagePicker: {
    width: 150,
    height: 150,
    backgroundColor: '#eee',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  imageText: {
    color: '#666',
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  input: {
    width: '100%',
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: 'center',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
  },
  profileImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
    marginBottom: 20,
  },
  profileText: {
    fontSize: 18,
    marginBottom: 10,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputFlex: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
});
