// matchAlgorithm.js

import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Function to compare answers and calculate a match score
export const compareAnswers = (userAnswers, otherUserAnswers) => {
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
export const findBestMatch = async (email) => {
  try {
    const userRef = doc(db, 'users', email);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
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

    return bestMatch ? { ...bestMatch, score: bestScore } : { score: bestScore };
  } catch (error) {
    console.error('Error finding match:', error);
    throw new Error('An error occurred while finding matches.');
  }
};
