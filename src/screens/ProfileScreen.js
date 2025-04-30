import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';


export default function ProfileScreen() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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

  const handleSubmit = () => {
    if (name && email && image) {
      setSubmitted(true);
    } else {
      alert('Please fill in all fields and upload an image.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {submitted ? (
        <View style={styles.profileContainer}>
            <Image source={{ uri: image }} style={styles.profileImage} />
            <Text style={styles.profileText}>Name: {name}</Text>
            <Text style={styles.profileText}>Email: {email}</Text>
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
            <TextInput
              placeholder="First and last name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Villanova email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />
            
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
  },
  profile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
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
 
});
