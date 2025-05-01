import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Calculate total score by summing absolute differences for each question.
 * Lower total = more similar.
 */
const calculateScore = (userA, userB) => {
  let score = 0;
  const keys = Object.keys(userA); // Collects all the keys from userA's answers.

  keys.forEach((key) => {
    const a = userA[key] ?? 0;
    const b = userB[key] ?? 0;
    score += Math.abs(a - b); // Adds up the absolute differences between each answer.
  });

  return score;
};

/**
 * Find the best match for a user based on questionnaire answers.
 */
export const findBestMatch = async (myAnswers, myEmail) => {
  const snapshot = await getDocs(collection(db, 'users')); // Fetch all users' data from Firestore.
  let bestMatch = null;
  let bestScore = Infinity; // Start with an infinite score for comparison.

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    // Ensure that we skip the current user, users without email, or users without answers.
    if (!data.email || data.email === myEmail || !data.answers) return;

    // Log the data for debugging to see which user is being compared.
    console.log('Comparing with user:', data.email);

    const score = calculateScore(myAnswers, data.answers); // Calculate score based on answers.

    console.log('Score with', data.email, ':', score); // Log the calculated score.

    // If this score is lower than the current best score, we set it as the new best match.
    if (score < bestScore) {
      bestScore = score;
      bestMatch = {
        fullName: data.fullName || 'No Name', // Store basic user info.
        email: data.email,
        profilePic: data.profilePic || null,
        hobbies: data.hobbies || '',
        favoriteSong: data.favoriteSong || '',
        hiddenTalent: data.hiddenTalent || '',
        answers: data.answers, // Store the answers.
        score, // The calculated score (lower is better).
      };
    }
  });

  // Log the best match found.
  if (bestMatch) {
    console.log('Best match found:', bestMatch.email);
  } else {
    console.log('No match found.');
  }

  // Return the best match found.
  return bestMatch;
};
