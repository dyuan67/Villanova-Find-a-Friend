import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { db } from '../firebase'; // Assuming you're using Firestore
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';

export default function MatchesScreen({ route }) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { email } = route.params || {}; // Check if email is passed properly

  useEffect(() => {
    if (!email) {
      setError('No email passed to MatchesScreen');
      setLoading(false);
      return;
    }

    const fetchMatch = async () => {
      const bestMatch = await findBestMatch(email);
      if (bestMatch) {
        setMatch(bestMatch);
        setLoading(false);
      } else {
        setError('No matches found.');
        setLoading(false);
      }
    };

    fetchMatch();
  }, [email]);

  // Function to compare answers and calculate a match score
  const compareAnswers = (userAnswers, otherUserAnswers) => {
    let score = 0;
    const totalQuestions = Object.keys(userAnswers).length;

    Object.keys(userAnswers).forEach((questionId) => {
      if (userAnswers[questionId] === otherUserAnswers[questionId]) {
        score++;
      }
    });

    return (score / totalQuestions) * 100; // return percentage match
  };

  // Function to find the best match
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
        if (doc.id !== email) { // Skip the current user
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
      {match ? (
        <View style={styles.matchContainer}>
          <Text style={styles.matchText}>You matched with: {match.name}</Text>
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
});

