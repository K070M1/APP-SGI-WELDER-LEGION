import React from 'react';
import { View, Text } from 'react-native';
import { SignInForm } from '../components/sign-in-form'

export function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
      <SignInForm />
    </View>
  );
}