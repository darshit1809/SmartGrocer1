// Profile screen
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import Input from '../components/ui/Input';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    store: '',
    role: '',
  });
  const [draft, setDraft] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  const hasDetails = useMemo(
    () => Object.values(profile).some((value) => value.trim().length > 0),
    [profile]
  );

  const startEditing = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => navigation.replace('Login') }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {isEditing ? (
        <View style={styles.form}>
          <Text style={styles.inputLabel}>Name</Text>
          <Input
            style={styles.input}
            placeholder="Enter name"
            value={draft.name}
            onChangeText={(text) => setDraft((prev) => ({ ...prev, name: text }))}
          />

          <Text style={styles.inputLabel}>Email</Text>
          <Input
            style={styles.input}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={draft.email}
            onChangeText={(text) => setDraft((prev) => ({ ...prev, email: text }))}
          />

          <Text style={styles.inputLabel}>Store</Text>
          <Input
            style={styles.input}
            placeholder="Enter store name"
            value={draft.store}
            onChangeText={(text) => setDraft((prev) => ({ ...prev, store: text }))}
          />

          <Text style={styles.inputLabel}>Role</Text>
          <Input
            style={styles.input}
            placeholder="Enter role"
            value={draft.role}
            onChangeText={(text) => setDraft((prev) => ({ ...prev, role: text }))}
          />
        </View>
      ) : (
        <>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{profile.name || 'Not set'}</Text>
          </View>
          
          <View style={styles.infoBox}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{profile.email || 'Not set'}</Text>
          </View>
          
          <View style={styles.infoBox}>
            <Text style={styles.label}>Store:</Text>
            <Text style={styles.value}>{profile.store || 'Not set'}</Text>
          </View>
          
          <View style={styles.infoBox}>
            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value}>{profile.role || 'Not set'}</Text>
          </View>
        </>
      )}

      {isEditing ? (
        <>
          <CustomButton title="Save Details" onPress={handleSave} />
          <CustomButton title="Cancel" onPress={handleCancel} />
        </>
      ) : (
        <CustomButton
          title={hasDetails ? 'Edit Details' : 'Add Details'}
          onPress={startEditing}
        />
      )}

      <CustomButton title="Back to Dashboard" onPress={() => navigation.goBack()} />
      <CustomButton title="Logout" onPress={handleLogout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    color: '#000',
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ProfileScreen;
