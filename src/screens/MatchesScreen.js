import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function MatchesScreen() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [matches, setMatches] = useState([]);
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

  const findTopMatches = async (email) => {
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
      const matches = [];

      allUsersSnapshot.forEach((docSnap) => {
        if (docSnap.id !== email) {
          const data = docSnap.data();
          const otherUserAnswers = data.answers;
          const score = compareAnswers(userAnswers, otherUserAnswers);
          matches.push({ ...data, score });
        }
      });

      // Sort matches by score descending and pick top 3
      const topMatches = matches.sort((a, b) => b.score - a.score).slice(0, 3);
      return topMatches;
    } catch (error) {
      console.error('Error finding matches:', error);
      setError('An error occurred while finding matches.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProfileAndMatches = async () => {
      try {
        const profileString = await AsyncStorage.getItem('profileData');
        if (profileString) {
          const profile = JSON.parse(profileString);
          console.log('Loaded profile from AsyncStorage:', profile);
          setEmail(profile.email);
          setFullName(profile.fullName);

          const bestMatches = await findTopMatches(profile.email);
          setMatches(bestMatches);
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

    loadProfileAndMatches();
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
      <Text style={styles.title}>Top 3 Matches</Text>
      {email && <Text style={styles.userText}>Logged in as: {fullName} ({email})</Text>}

      {matches.length > 0 ? (
        matches.map((match, index) => (
          <View key={index} style={styles.matchContainer}>
            {match.profilePic && (
              <Image source={{ uri: match.profilePic }} style={styles.profileImage} />
            )}
            <Text style={styles.matchText}>
              {index + 1}. {match.fullName || match.name}
            </Text>
            <Text style={styles.matchText}>Email: {match.email}</Text>
            <Text style={styles.matchText}>Match Score: {match.score.toFixed(2)}%</Text>

            {match.hobbies && (
              <Text style={styles.matchText}>
                Hobbies: {Array.isArray(match.hobbies) ? match.hobbies.join(', ') : match.hobbies}
              </Text>
            )}
            {match.hiddenTalent && (
              <Text style={styles.matchText}>
                Talents: {Array.isArray(match.hiddenTalent) ? match.hiddenTalent.join(', ') : match.hiddenTalent}
              </Text>
            )}
            {match.favoriteSong && (
              <Text style={styles.matchText}>
                Favorite Music: {Array.isArray(match.favoriteSong) ? match.favoriteSong.join(', ') : match.favoriteSong}
              </Text>
            )}
          </View>
        ))
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
    marginTop: 30,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  matchText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
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
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
});
