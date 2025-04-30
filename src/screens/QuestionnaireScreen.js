import React, { useState } from 'react';
import {View, Text, Pressable, FlatList, StyleSheet, ScrollView, Alert, Button,} from 'react-native';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

const questions = [
  { id: 'q1', text: 'I enjoy socializing with others.' },
  { id: 'q2', text: 'I make decisions based on logic.' },
  { id: 'q3', text: 'I prefer planning over spontaneity.' },
  { id: 'q4', text: 'I find it easy to express my feelings.' },
  { id: 'q5', text: 'I get energy from being alone.' },
];

export default function QuestionnaireScreen() {
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const renderQuestion = ({ item }) => (
    <View style={styles.questionBlock}>
      <Text style={styles.questionText}>{item.text}</Text>
      <View style={styles.optionsRow}>
        {[1, 2, 3, 4, 5].map((value) => ( //questions
          <Pressable
            key={value}
            onPress={() => handleAnswer(item.id, value)}
            style={[
              styles.optionButton,
              answers[item.id] === value && styles.selected,
            ]}
          >
            <Text style={styles.optionText}>{value}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const handleSubmit = async () => {
    const unanswered = questions
      .filter((q) => answers[q.id] == null)
      .map((q, i) => i + 1);

    if (unanswered.length > 0) {
      const message =
        unanswered.length === 1
          ? `Please answer Question ${unanswered[0]} before submitting.`
          : `Please answer Questions: ${unanswered.join(', ')} before submitting.`;

      Alert.alert('Incomplete', message);
      return;
    }

    try {
      //save answers to Firestore anonymously for now
      await addDoc(collection(db, 'questionnaires'), {
        answers,
        submittedAt: Date.now(),
      });

      Alert.alert('Thank you!', 'Your answers have been saved.');
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      Alert.alert('Error', 'Something went wrong while saving.');
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Questionnaire</Text>

      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={renderQuestion}
        scrollEnabled={false}
      />

      <View style={styles.legendBox}>
        <Text style={styles.legendTitle}>Answer Key:</Text>
        <Text style={styles.legendLine}>1 = Strongly Disagree</Text>
        <Text style={styles.legendLine}>2 = Slightly Disagree</Text>
        <Text style={styles.legendLine}>3 = Neutral</Text>
        <Text style={styles.legendLine}>4 = Slightly Agree</Text>
        <Text style={styles.legendLine}>5 = Strongly Agree</Text>
      </View>

      <View style={styles.submitButton}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60, 
    paddingBottom: 100,
    paddingHorizontal: 24
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionBlock: {
    marginBottom: 30,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    color: '#000',
  },
  submitButton: {
    marginTop: 20,
  },
  debugText: {
    marginTop: 30,
    fontSize: 12,
    color: 'gray',
  },
  legendBox: {
    marginTop: 20,
  },
  legendTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  legendLine: {
    fontSize: 13,
    color: 'gray',
  },
});
