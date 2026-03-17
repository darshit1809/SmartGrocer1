// Reusable Button component
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
};

const Button = ({ title, onPress }: ButtonProps) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{title}</Text>
  </TouchableOpacity>
);

export default Button;
