import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';

interface ProfileData {
  name: string;
  email: string;
  shopName: string;
  role: string;
  phone: string;
}

const emptyProfile: ProfileData = {
  name: '',
  email: '',
  shopName: '',
  role: '',
  phone: '',
};

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [draft, setDraft] = useState<ProfileData>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const nextProfile: ProfileData = {
            name: (data.name as string) || '',
            email: (data.email as string) || user.email || '',
            shopName: (data.shopName as string) || '',
            role: (data.role as string) || '',
            phone: (data.phone as string) || '',
          };
          setProfile(nextProfile);
          setDraft(nextProfile);
        } else {
          const nextProfile: ProfileData = {
            ...emptyProfile,
            email: user.email || '',
          };
          setProfile(nextProfile);
          setDraft(nextProfile);
        }
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const hasDetails = useMemo(
    () => Object.values(profile).some((value) => value.trim().length > 0),
    [profile]
  );

  const startEditing = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          name: draft.name,
          email: draft.email,
          shopName: draft.shopName,
          role: draft.role,
          phone: draft.phone,
        },
        { merge: true }
      );
      setProfile(draft);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile', error);
      Alert.alert('Error', 'Failed to save details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          router.replace('/');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Account</Text>

      {isEditing ? (
        <View>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={draft.name}
            onChangeText={(text) => setDraft((prev) => ({ ...prev, name: text }))}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={draft.email}
            onChangeText={(text) => setDraft((prev) => ({ ...prev, email: text }))}
          />

          <Text style={styles.label}>Shop Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter shop name"
            value={draft.shopName}
            onChangeText={(text) => setDraft((prev) => ({ ...prev, shopName: text }))}
          />

          <Text style={styles.label}>Role</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter role"
            value={draft.role}
            onChangeText={(text) => setDraft((prev) => ({ ...prev, role: text }))}
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone"
            keyboardType="phone-pad"
            value={draft.phone}
            onChangeText={(text) => setDraft((prev) => ({ ...prev, phone: text }))}
          />
        </View>
      ) : (
        <View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{profile.name || 'Not set'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profile.email || 'Not set'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Shop Name</Text>
            <Text style={styles.infoValue}>{profile.shopName || 'Not set'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>{profile.role || 'Not set'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{profile.phone || 'Not set'}</Text>
          </View>
        </View>
      )}

      {isEditing ? (
        <>
          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Save Details</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleCancel}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={startEditing}>
          <Text style={styles.buttonText}>{hasDetails ? 'Edit Details' : 'Add Details'}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.secondaryButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    backgroundColor: '#FF8C00',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
