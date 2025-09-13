import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export class PaymentService {
  // Mark payment as completed and update user earnings
  static async markPaymentCompleted(hustleId: string, workerId: string, amount: number): Promise<void> {
    try {
      console.log('PaymentService: Marking payment completed:', { hustleId, workerId, amount });
      
      // Update hustle status to completed
      const hustleRef = doc(db, 'hustles', hustleId);
      await updateDoc(hustleRef, {
        status: 'completed',
        paymentCompleted: true,
        paymentCompletedAt: new Date().toISOString()
      });
      
      console.log('PaymentService: Hustle status updated to completed');
      
      // Update worker's profile with earned money
      const userRef = doc(db, 'users', workerId);
      await updateDoc(userRef, {
        totalEarned: increment(amount),
        completedHustles: increment(1),
        updatedAt: new Date().toISOString()
      });
      
      console.log('PaymentService: Worker profile updated with earned money:', amount);
      console.log('PaymentService: Payment marked as completed successfully');
    } catch (error) {
      console.error('PaymentService: Error marking payment completed:', error);
      throw error;
    }
  }

  // Submit rating for a user
  static async submitRating(ratedUserId: string, rating: number, review: string, raterId: string): Promise<void> {
    try {
      console.log('PaymentService: Submitting rating:', { ratedUserId, rating, review, raterId });
      
      // Get current user data
      const userRef = doc(db, 'users', ratedUserId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const currentRating = userData.rating || 0;
        const totalRatings = userData.totalRatings || 0;
        
        // Calculate new average rating
        const newTotalRatings = totalRatings + 1;
        const newRating = ((currentRating * totalRatings) + rating) / newTotalRatings;
        
        // Update user rating
        await updateDoc(userRef, {
          rating: newRating,
          totalRatings: newTotalRatings
        });
        
        // Store the review (you might want to create a separate reviews collection)
        console.log('PaymentService: Rating submitted successfully');
      }
    } catch (error) {
      console.error('PaymentService: Error submitting rating:', error);
      throw error;
    }
  }
}
