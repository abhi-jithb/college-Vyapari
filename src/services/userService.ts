import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types';

export class UserService {
  // Get user data by ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      console.log('UserService: Getting user by ID:', userId);
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        console.log('UserService: User found:', userData);
        return userData;
      } else {
        console.log('UserService: User not found');
        return null;
      }
    } catch (error) {
      console.error('UserService: Error getting user:', error);
      throw error;
    }
  }

  // Listen to real-time user profile updates
  static subscribeToUserProfile(userId: string, callback: (user: User | null) => void): () => void {
    console.log('UserService: Setting up real-time listener for user:', userId);
    
    const userRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data() as User;
        console.log('UserService: Real-time user update received:', userData);
        callback(userData);
      } else {
        console.log('UserService: User document does not exist');
        callback(null);
      }
    }, (error) => {
      console.error('UserService: Error in real-time listener:', error);
      callback(null);
    });

    return unsubscribe;
  }
}
