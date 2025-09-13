import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import { User } from '../types';

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, userData: Omit<User, 'id'>): Promise<User> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user document in Firestore
      const userDoc = {
        id: firebaseUser.uid,
        name: userData.name,
        email: userData.email,
        college: userData.college,
        department: userData.department || '',
        year: userData.year || '',
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);
      
      return userDoc;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        throw new Error('User document not found');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<{ user: User | null; needsCollegeInfo: boolean }> {
    try {
      console.log('Starting Google sign-in...');
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      console.log('Google sign-in successful:', firebaseUser.uid, firebaseUser.email);
      
      // Check if user document exists
      console.log('Checking user document in Firestore...');
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      console.log('User document exists:', userDoc.exists());
      
      if (userDoc.exists()) {
        // User exists, return their data
        const userData = userDoc.data() as User;
        console.log('Returning existing user:', userData);
        return { user: userData, needsCollegeInfo: false };
      } else {
        // New user, create basic profile and return null to trigger college selection
        console.log('Creating new user document...');
        const basicUserData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          college: '', // Will be filled in college selection
          department: '',
          year: '',
          createdAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), basicUserData);
        console.log('User document created successfully');
        
        return { user: null, needsCollegeInfo: true };
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Complete Google sign-in with college information
  static async completeGoogleSignIn(college: string, department?: string, year?: string): Promise<User> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('No authenticated user');
      }

      const userData = {
        college,
        department: department || '',
        year: year || '',
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      // Return updated user data
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        throw new Error('User document not found');
      }
    } catch (error) {
      console.error('Error completing Google sign-in:', error);
      throw error;
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('AuthService: Auth state changed, firebaseUser:', firebaseUser?.uid, firebaseUser?.email);
      
      if (firebaseUser) {
        try {
          console.log('AuthService: Getting user data from Firestore...');
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          console.log('AuthService: User document exists:', userDoc.exists());
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            console.log('AuthService: Returning user data:', userData);
            callback(userData);
          } else {
            console.log('AuthService: User document not found, returning null');
            callback(null);
          }
        } catch (error) {
          console.error('AuthService: Error getting user data:', error);
          callback(null);
        }
      } else {
        console.log('AuthService: No firebase user, returning null');
        callback(null);
      }
    });
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}
