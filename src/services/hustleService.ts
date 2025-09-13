import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Hustle } from '../types';

export class HustleService {
  // Add a new hustle
  static async addHustle(hustleData: Omit<Hustle, 'id' | 'createdAt' | 'status'>): Promise<string> {
    try {
      console.log('HustleService: Adding hustle with data:', hustleData);
      
      const hustleDoc = {
        ...hustleData,
        createdAt: Timestamp.now(),
        status: 'open'
      };
      
      console.log('HustleService: Hustle document to create:', hustleDoc);
      
      const docRef = await addDoc(collection(db, 'hustles'), hustleDoc);
      console.log('HustleService: Hustle created successfully with ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('HustleService: Error adding hustle:', error);
      console.error('HustleService: Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Update hustle status
  static async updateHustleStatus(hustleId: string, status: 'open' | 'accepted' | 'completed', acceptedBy?: string): Promise<void> {
    try {
      console.log('HustleService: Updating hustle status:', { hustleId, status, acceptedBy });
      
      const hustleRef = doc(db, 'hustles', hustleId);
      const updateData: any = { status };
      
      if (acceptedBy) {
        updateData.acceptedBy = acceptedBy;
      }
      
      console.log('HustleService: Update data:', updateData);
      
      await updateDoc(hustleRef, updateData);
      console.log('HustleService: Hustle status updated successfully');
    } catch (error) {
      console.error('HustleService: Error updating hustle status:', error);
      console.error('HustleService: Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Get all hustles for a specific college
  static async getHustlesByCollege(college: string): Promise<Hustle[]> {
    try {
      console.log('HustleService: Getting hustles for college:', college);
      
      const q = query(
        collection(db, 'hustles'),
        where('college', '==', college)
      );
      
      const querySnapshot = await getDocs(q);
      console.log('HustleService: Query snapshot size:', querySnapshot.size);
      
      const hustles: Hustle[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('HustleService: Document data:', data);
        
        const hustle = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
        } as Hustle;
        hustles.push(hustle);
      });
      
      // Sort by createdAt manually
      hustles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log('HustleService: Returning', hustles.length, 'hustles');
      return hustles;
    } catch (error) {
      console.error('HustleService: Error getting hustles:', error);
      throw error;
    }
  }

  // Get user's hustles (posted and accepted)
  static async getUserHustles(userId: string): Promise<{ posted: Hustle[]; accepted: Hustle[] }> {
    try {
      console.log('HustleService: Getting user hustles for userId:', userId);
      
      const postedQuery = query(
        collection(db, 'hustles'),
        where('postedBy', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const acceptedQuery = query(
        collection(db, 'hustles'),
        where('acceptedBy', '==', userId)
      );
      
      const [postedSnapshot, acceptedSnapshot] = await Promise.all([
        getDocs(postedQuery),
        getDocs(acceptedQuery)
      ]);
      
      console.log('HustleService: Posted hustles found:', postedSnapshot.size);
      console.log('HustleService: Accepted hustles found:', acceptedSnapshot.size);
      
      const posted: Hustle[] = [];
      const accepted: Hustle[] = [];
      
      postedSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('HustleService: Posted hustle data:', data);
        posted.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate().toISOString()
        } as Hustle);
      });
      
      acceptedSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('HustleService: Accepted hustle data:', data);
        accepted.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate().toISOString()
        } as Hustle);
      });
      
      // Sort accepted hustles manually
      accepted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log('HustleService: Returning user hustles:', { posted: posted.length, accepted: accepted.length });
      return { posted, accepted };
    } catch (error) {
      console.error('HustleService: Error getting user hustles:', error);
      throw error;
    }
  }

  // Listen to real-time updates for college hustles
  static subscribeToCollegeHustles(college: string, callback: (hustles: Hustle[]) => void): () => void {
    console.log('HustleService: Setting up real-time listener for college:', college);
    
    // First try without orderBy to see if that's the issue
    const q = query(
      collection(db, 'hustles'),
      where('college', '==', college)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      console.log('HustleService: Real-time update received, documents:', querySnapshot.size);
      
      const hustles: Hustle[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('HustleService: Raw document data:', data);
        
        const hustle = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
        } as Hustle;
        hustles.push(hustle);
        console.log('HustleService: Processed hustle:', hustle.id, hustle.title);
      });
      
      // Sort by createdAt manually since we removed orderBy
      hustles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log('HustleService: Calling callback with', hustles.length, 'hustles');
      callback(hustles);
    }, (error) => {
      console.error('HustleService: Real-time listener error:', error);
      console.error('HustleService: Error details:', {
        code: error.code,
        message: error.message
      });
    });
  }
}
