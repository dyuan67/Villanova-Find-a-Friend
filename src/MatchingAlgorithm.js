import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Compare two answer sets by counting how many answers match for each question.
 */
const calculateSimilarity = (a1, a2) => {
  const keys = Object.keys(a1);
  let matchCount = 0;

  // Count the number of matching answers
  keys.forEach((q) => {
    if (a1[q] === a2[q]) {
      matchCount++;
    }
  });

  return matchCount;
};

/**
 * Find best match from all users in Firestore.
 * @param {*} myAnswers - current user's questionnaire answers
 * @param {*} myEmail   - current user's email (to exclude themselves)
 * @returns profile info + match score
 */
export const findBestMatch = async (myAnswers, myEmail) => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    let bestMatch = null;
    let bestScore = -1; // Start with -1 because the match count can never be less than 0

    snapshot.forEach((doc) => {
      const user = doc.data();

      // Skip self or if answers are missing
      if (user.email === myEmail || !user.answers) return;

      const matchCount = calculateSimilarity(myAnswers, user.answers);

      if (matchCount > bestScore) {
        bestScore = matchCount;
        bestMatch = {
          fullName: user.fullName || 'Anonymous',
          email: user.email,
          profilePic: user.profilePic || null,
          answers: user.answers,
          matchCount,
        };
      }
    });

    return bestMatch;
  } catch (error) {
    console.error("Error finding best match:", error);
    return null;
  }
};


