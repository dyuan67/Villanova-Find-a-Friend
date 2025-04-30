import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, ScrollView, ActivityIndicator,} from 'react-native';
import { findBestMatch } from '../MatchingAlgorithm';

export default function MatchesScreen({ route }) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const myAnswers = route?.params?.answers;

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const result = await findBestMatch(myAnswers);
        setMatch(result);
      } catch (error) {
        console.error('Error fetching match:', error);
      } finally {
        setLoading(false);
      }
    };

    if (myAnswers) {
      fetchMatch();
    } else {
      setLoading(false);
    }
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
        <Text>No match found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Best Match</Text>
      <View style={styles.box}>
        <Text style={styles.subtitle}>
          Similarity Score: {match.score.toFixed(2)}
        </Text>
        <Text style={styles.section}>Answers:</Text>
        {Object.entries(match.data).map(([key, value]) => (
          <Text key={key} style={styles.answerLine}>
            {key}: {value}
          </Text>
        ))}
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
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  box: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
  },
  section: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  answerLine: {
    fontSize: 14,
    marginVertical: 2,
  },
});
