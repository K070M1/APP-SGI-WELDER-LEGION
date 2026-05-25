import React from 'react';
import { View } from 'react-native';
import { ForgotPasswordForm } from '../components/forgot-password-form';

export function ForgotPasswordScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
      <ForgotPasswordForm />
    </View>
  );
}
