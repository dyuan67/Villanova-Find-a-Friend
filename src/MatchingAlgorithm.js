// src/utils/MatchingAlgorithm.js

import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Calculates the average absolute difference between two sets of answers.
 * Lower scores mean higher similarity.
 */
const calculateSimilarity = (a1, a2) => {
  const keys = Object.keys(a1);
  const differences = keys.map((q) => Math.abs((a1[q] || 0) - (a2[q] || 0)));
  const score = differences.reduce((sum, d) => sum + d, 0) / keys.length;
  return score;
};

/**
 * Finds the most similar questionnaire in Firestore to the given answers.
 * Returns the matching document's data (not ID).
 */
export const findBestMatch = async (myAnswers) => {
  const snapshot = await getDocs(collection(db, 'questionnaires'));
  let bestMatch = null;
  let bestScore = Infinity;

  snapshot.forEach((doc) => {
    const other = doc.data().answers;

    // Skip if same answers (optional)
    if (JSON.stringify(other) === JSON.stringify(myAnswers)) return;

    const score = calculateSimilarity(myAnswers, other);

    if (score < bestScore) {
      bestScore = score;
      bestMatch = {
        data: other,
        docId: doc.id,
        score,
      };
    }
  });

  return bestMatch;
};

