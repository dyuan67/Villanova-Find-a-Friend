// src/MatchingAlgorithm.js
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Compare two answer sets using Mean Absolute Difference.
 */
const calculateSimilarity = (a1, a2) => {
  const keys = Object.keys(a1);
  const diffs = keys.map((q) => Math.abs((a1[q] ?? 0) - (a2[q] ?? 0)));
  const score = diffs.reduce((sum, d) => sum + d, 0) / keys.length;
  return score;
};

/**
 * Find best match from all users in Firestore.
 * @param {*} myAnswers - current user's questionnaire answers
 * @param {*} myEmail   - current user's email (to exclude themselves)
 * @returns profile info + match score
 */
export const findBestMatch = async (myAnswers, myEmail) => {
  const snapshot = await getDocs(collection(db, 'users'));
  let bestMatch = null;
  let bestScore = Infinity;

  snapshot.forEach((doc) => {
    const user = doc.data();

    // Skip self or if answers are missing
    if (user.email === myEmail || !user.answers) return;

    const score = calculateSimilarity(myAnswers, user.answers);

    if (score < bestScore) {
      bestScore = score;
      bestMatch = {
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic || null,
        answers: user.answers,
        score,
      };
    }
  });

  return bestMatch;
};


