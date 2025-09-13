import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Phone, Mail, Star } from 'lucide-react';
import { Hustle, User } from '../types';
import { useHustle } from '../context/HustleContext';
import { useAuth } from '../context/AuthContext';
import { UserService } from '../services/userService';
import { PaymentService } from '../services/paymentService';

interface CommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  hustle: Hustle;
  userType: 'poster' | 'worker';
  otherUser: {
    name: string;
    email: string;
    id: string;
  };
}

const CommunicationModal: React.FC<CommunicationModalProps> = ({
  isOpen,
  onClose,
  hustle,
  userType,
  otherUser
}) => {
  const { completeHustle } = useHustle();
  const { user } = useAuth();
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [otherUserData, setOtherUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [markingPayment, setMarkingPayment] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  // Fetch other user data when modal opens
  useEffect(() => {
    if (isOpen && otherUser.id) {
      setLoading(true);
      UserService.getUserById(otherUser.id)
        .then((userData) => {
          setOtherUserData(userData);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, otherUser.id]);

  if (!isOpen) return null;

  const handleCompleteWork = async () => {
    setCompleting(true);
    try {
      console.log('CommunicationModal: Completing hustle:', hustle.id);
      await completeHustle(hustle.id);
      console.log('CommunicationModal: Hustle completed successfully');
      setShowRating(true);
    } catch (error) {
      console.error('CommunicationModal: Error completing hustle:', error);
      // You could show an error message here
    } finally {
      setCompleting(false);
    }
  };

  const handleMarkPaymentCompleted = async () => {
    if (!user || !hustle.acceptedBy) return;
    
    setMarkingPayment(true);
    try {
      console.log('CommunicationModal: Marking payment completed for hustle:', hustle.id);
      await PaymentService.markPaymentCompleted(hustle.id, hustle.acceptedBy, hustle.amount);
      console.log('CommunicationModal: Payment marked as completed successfully');
      setPaymentCompleted(true);
    } catch (error) {
      console.error('CommunicationModal: Error marking payment completed:', error);
    } finally {
      setMarkingPayment(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!user || !otherUser.id) return;
    
    setSubmittingRating(true);
    try {
      console.log('CommunicationModal: Submitting rating:', { rating, review, ratedUserId: otherUser.id });
      await PaymentService.submitRating(otherUser.id, rating, review, user.id);
      console.log('CommunicationModal: Rating submitted successfully');
      onClose();
    } catch (error) {
      console.error('CommunicationModal: Error submitting rating:', error);
    } finally {
      setSubmittingRating(false);
    }
  };

  const handlePaymentComplete = () => {
    setPaymentCompleted(true);
    setShowRating(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            <MessageCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Contact {otherUser.name}</h2>
          <p className="text-gray-400 text-sm">
            {hustle.title}
          </p>
        </div>

        {!showRating ? (
          <>
            {/* Contact Information */}
            <div className="space-y-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
                      <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center text-gray-300">
                        <Mail size={16} className="mr-2" />
                        <span className="text-sm">{otherUserData?.email || otherUser.email}</span>
                      </div>
                      {otherUserData?.phone && (
                        <div className="flex items-center text-gray-300">
                          <Phone size={16} className="mr-2" />
                          <span className="text-sm">{otherUserData.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-300">
                        <span className="text-sm">College: {hustle.college}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Work Details */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Work Details</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><strong>Amount:</strong> ₹{hustle.amount}</p>
                  <p><strong>Status:</strong> {hustle.status}</p>
                  {hustle.deadline && (
                    <p><strong>Deadline:</strong> {new Date(hustle.deadline).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Only worker can see contact info and complete work */}
              {userType === 'worker' && !paymentCompleted && (
                <button
                  onClick={handleCompleteWork}
                  disabled={completing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed"
                >
                  {completing ? 'Completing...' : 'Complete Work'}
                </button>
              )}

              {/* Show rating section after payment is completed */}
              {paymentCompleted && !showRating && (
                <div className="text-center">
                  <p className="text-green-400 text-sm mb-3">✅ Payment completed! Rate your experience:</p>
                  <button
                    onClick={() => setShowRating(true)}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/30"
                  >
                    Rate & Review
                  </button>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          /* Rating Section */
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-2">Rate {otherUser.name}</h3>
              <p className="text-gray-400 text-sm">How was your experience working with them?</p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                >
                  <Star size={32} fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>

            {/* Review */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Review (Optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
              />
            </div>

            {/* Submit Rating */}
            <button
              onClick={handleSubmitRating}
              disabled={rating === 0 || submittingRating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed"
            >
              {submittingRating ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationModal;
