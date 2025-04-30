import React, { useState } from 'react';
import {View, Text, Pressable, FlatList, StyleSheet, ScrollView, Alert, Button,} from 'react-native';

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
        {[1, 2, 3, 4, 5].map((value) => (
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

  const handleSubmit = () => {
    const unanswered = questions.find((q, i) => answers[q.id] == null);
    if (unanswered) {
      Alert.alert(
        'Incomplete',
        `Please answer Question ${questions.findIndex(q => q.id === unanswered.id) + 1} before submitting.`
      );
      return;
    }
  
    Alert.alert('Thank you!', 'You have completed the questionnaire.');
    // console.log(answers); // save to Firebase if needed
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

      <View style={styles.submitButton}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20, 
    paddingBottom: 100,
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
});
