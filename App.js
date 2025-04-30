import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from './src/navigation/AppNavigation';
import QuestionnaireScreen from './src/screens/QuestionnaireScreen';

export default function App() {
  return (
    <AppNavigation />
  );
}