import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { findBestMatch } from '../MatchingAlgorithm';

export default function MatchesScreen() {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const email = await AsyncStorage.getItem("email");
        if (!email) {
          console.warn("No email found in AsyncStorage.");
          setLoading(false);
          return;
        }

        const userSnap = await getDoc(doc(db, 'users', email));
        const currentUser = userSnap.data();

        if (!currentUser?.answers) {
          console.warn("User has no questionnaire answers.");
          setLoading(false);
          return;
        }

        const result = await findBestMatch(currentUser.answers, email);
        setMatch(result);
      } catch (error) {
        console.error('Error fetching match:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Finding your best match...</Text>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.centered}>
        <Text>No match found yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Best Match</Text>

      <View style={styles.box}>
        {match.profilePic && (
          <Image source={{ uri: match.profilePic }} style={styles.image} />
        )}
        <Text style={styles.name}>{match.fullName}</Text>
        <Text style={styles.email}>{match.email}</Text>

        <Text style={styles.label}>Similarity Score:</Text>
        <Text style={styles.value}>{match.score.toFixed(2)}</Text>

        {match.hobbies && (
          <>
            <Text style={styles.label}>Hobbies:</Text>
            <Text style={styles.value}>{match.hobbies}</Text>
          </>
        )}
        {match.favoriteSong && (
          <>
            <Text style={styles.label}>Favorite Song:</Text>
            <Text style={styles.value}>{match.favoriteSong}</Text>
          </>
        )}
        {match.hiddenTalent && (
          <>
            <Text style={styles.label}>Hidden Talent:</Text>
            <Text style={styles.value}>{match.hiddenTalent}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  box: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 12,
  },
  label: {
    marginTop: 12,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginBottom: 6,
  },
});

