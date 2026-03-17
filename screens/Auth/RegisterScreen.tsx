// Registration screen for new users
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image } from 'react-native';
import CustomButton from '../../components/CustomButton';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!shopName || !ownerName || !mobile || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    if (mobile.length !== 10) {
      Alert.alert('Error', 'Please enter valid 10 digit mobile number');
      return;
    }
    
    Alert.alert('Success', 'Registration successful!', [
      { text: 'OK', onPress: () => navigation.navigate('Login') }
    ]);
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/splash.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <View style={styles.inputContainer}>
        <Text style={styles.icon}>🏪</Text>
        <TextInput
          style={styles.input}
          placeholder="Shop Name"
          placeholderTextColor="#999"
          value={shopName}
          onChangeText={setShopName}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.icon}>👤</Text>
        <TextInput
          style={styles.input}
          placeholder="Owner Name"
          placeholderTextColor="#999"
          value={ownerName}
          onChangeText={setOwnerName}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.icon}>📱</Text>
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#999"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          maxLength={10}
        />
        <Text style={styles.countryCode}>+91</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.icon}>🔒</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      
      <CustomButton title="Register" onPress={handleRegister} />
      
      <CustomButton
        title="Back to Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: 150,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F9',
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#000',
  },
  countryCode: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
});

export default RegisterScreen;
