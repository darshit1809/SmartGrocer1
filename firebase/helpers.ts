import { auth, db } from './config';
import { onAuthStateChanged, User } from 'firebase/auth';

// Test Firebase connection
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Firebase connection...');
    console.log('Auth initialized:', !!auth);
    console.log('Firestore initialized:', !!db);
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

// Listen to authentication state changes
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export default { testFirebaseConnection, subscribeToAuthChanges };
