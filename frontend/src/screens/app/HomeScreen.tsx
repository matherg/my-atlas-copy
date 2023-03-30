import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Question from '../../components/Question';
import { useAuth } from '../../contexts/AuthContext';

const HomeScreen = () => {
  const [loading, isLoading] = useState(false);
  const auth = useAuth();
  const signOut = async () => {
    isLoading(true);
    await auth.signOut();
  };

  return (
    <SafeAreaView>
      <Question
        question={
          'Have you sought behavioral health or wellness care in the past?'
        }></Question>
    </SafeAreaView>
  );
};

export default HomeScreen;
