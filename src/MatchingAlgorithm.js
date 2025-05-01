import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Calculate total score by summing absolute differences for each question.
 * Lower total = more similar.
 */
const calculateScore = (userA, userB) => {
  let score = 0;
  const keys = Object.keys(userA);

  keys.forEach((key) => {
    const a = userA[key] ?? 0;
    const b = userB[key] ?? 0;
    score += Math.abs(a - b);
  });

  return score;
};

/**
 * Find the best match for a user based on questionnaire answers.
 */
export const findBestMatch = async (myAnswers, myEmail) => {
  const snapshot = await getDocs(collection(db, 'users'));
  let bestMatch = null;
  let bestScore = Infinity;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (!data.email || data.email === myEmail || !data.answers) return;

    const score = calculateScore(myAnswers, data.answers);

    if (score < bestScore) {
      bestScore = score;
      bestMatch = {
        fullName: data.fullName || 'No Name',
        email: data.email,
        profilePic: data.profilePic || null,
        hobbies: data.hobbies || '',
        favoriteSong: data.favoriteSong || '',
        hiddenTalent: data.hiddenTalent || '',
        answers: data.answers,
        score, // 🔥 Total difference across questions
      };
    }
  });

  return bestMatch;
};



