import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function MatchesScreen() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const compareAnswers = (userAnswers, otherUserAnswers) => {
    let score = 0;
    const totalQuestions = Object.keys(userAnswers).length;

    Object.keys(userAnswers).forEach((questionId) => {
      if (userAnswers[questionId] === otherUserAnswers[questionId]) {
        score++;
      }
    });

    return (score / totalQuestions) * 100;
  };

  const findBestMatch = async (email) => {
    try {
      const userRef = doc(db, 'users', email);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        setError('User not found.');
        setLoading(false);
        return;
      }

      const userAnswers = userDoc.data().answers;
      const allUsersSnapshot = await getDocs(collection(db, 'users'));
      let bestMatch = null;
      let bestScore = 0;

      allUsersSnapshot.forEach((doc) => {
        if (doc.id !== email) {
          const otherUserAnswers = doc.data().answers;
          const score = compareAnswers(userAnswers, otherUserAnswers);

          if (score > bestScore) {
            bestScore = score;
            bestMatch = doc.data();
          }
        }
      });

      return bestMatch ? { ...bestMatch, score: bestScore } : null;
    } catch (error) {
      console.error('Error finding match:', error);
      setError('An error occurred while finding matches.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProfileAndMatch = async () => {
      try {
        const profileString = await AsyncStorage.getItem('profileData');
        if (profileString) {
          const profile = JSON.parse(profileString);
          console.log('Loaded profile from AsyncStorage:', profile);
          setEmail(profile.email);
          setFullName(profile.fullName);

          const best = await findBestMatch(profile.email);
          setMatch(best);
        } else {
          setError('No profile data found in AsyncStorage.');
        }
      } catch (e) {
        console.error('Error loading profile data:', e);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndMatch();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Best Match</Text>
      {email && <Text style={styles.userText}>Logged in as: {fullName} ({email})</Text>}
      {match ? (
        <View style={styles.matchContainer}>
          {match.profilePic && (
            <Image source={{ uri: match.profilePic }} style={styles.profileImage} />
          )}
          <Text style={styles.matchText}>You matched with: {match.fullName || match.name}</Text>
          <Text style={styles.matchText}>Email: {match.email}</Text>
          <Text style={styles.matchText}>Match Score: {match.score.toFixed(2)}%</Text>
        </View>
      ) : (
        <Text style={styles.noMatchText}>No matches found</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 100,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: 'gray',
  },
  matchContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  matchText: {
    fontSize: 18,
    marginBottom: 10,
  },
  noMatchText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  profileImage: {
    width: 400,
    height: 400,
    borderRadius: 10,
    marginBottom: 20,
  },
});
