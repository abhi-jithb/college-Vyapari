import React, { useState } from 'react';
import { Clock, User, DollarSign, Calendar, CreditCard } from 'lucide-react';
import { Hustle } from '../types';
import { useAuth } from '../context/AuthContext';
import { useHustle } from '../context/HustleContext';
import CommunicationModal from './CommunicationModal';
import PaymentManagementModal from './PaymentManagementModal';

interface HustleCardProps {
  hustle: Hustle;
}

const HustleCard: React.FC<HustleCardProps> = ({ hustle }) => {
  const { user } = useAuth();
  const { acceptHustle } = useHustle();
  const [showCommunication, setShowCommunication] = useState(false);
  const [showPaymentManagement, setShowPaymentManagement] = useState(false);

  const handleAccept = async () => {
    if (user) {
      try {
        await acceptHustle(hustle.id, user.id);
      } catch (error) {
        console.error('Error accepting hustle:', error);
      }
    }
  };

  const isOwner = user?.id === hustle.postedBy;
  const isWorker = user?.id === hustle.acceptedBy;
  const canAccept = hustle.status === 'open' && !isOwner;
  const isAccepted = hustle.status === 'accepted';
  const isCompleted = hustle.status === 'completed';
  const canSeeContact = isWorker; // Only the person who took the work can see contact info

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'accepted':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white leading-tight">
          {hustle.title}
        </h3>
        <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(hustle.status)}`}>
          {hustle.status.charAt(0).toUpperCase() + hustle.status.slice(1)}
        </span>
      </div>

      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {hustle.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-400 text-sm">
          <User size={14} className="mr-2" />
          <span>{hustle.postedByName}</span>
          {hustle.postedByDepartment && (
            <span className="ml-1">• {hustle.postedByDepartment}</span>
          )}
        </div>

        <div className="flex items-center text-gray-400 text-sm">
          <Calendar size={14} className="mr-2" />
          <span>Posted {formatDate(hustle.createdAt)}</span>
        </div>

        {hustle.deadline && (
          <div className="flex items-center text-gray-400 text-sm">
            <Clock size={14} className="mr-2" />
            <span>Deadline: {formatDate(hustle.deadline)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-green-400 font-semibold">
          <span className="text-lg mr-1">₹</span>
          <span>{hustle.amount}</span>
        </div>

        {canAccept && (
          <button
            onClick={handleAccept}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30"
          >
            Accept Hustle
          </button>
        )}

        {isAccepted && canSeeContact && (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
              Work Taken by You
            </span>
            <button 
              onClick={() => setShowCommunication(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200"
            >
              Contact Poster
            </button>
          </div>
        )}

        {isAccepted && !canSeeContact && (
          <span className="text-xs text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
            Work Taken
          </span>
        )}

        {isCompleted && (
          <span className="text-xs text-green-400 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
            Completed
          </span>
        )}

        {isOwner && hustle.status === 'open' && (
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
            Your Post
          </span>
        )}

        {isOwner && isAccepted && (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
              Work Taken
            </span>
            <button 
              onClick={() => setShowPaymentManagement(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1"
            >
              <CreditCard size={12} />
              Manage Payment
            </button>
          </div>
        )}
      </div>

      {/* Communication Modal */}
      <CommunicationModal
        isOpen={showCommunication}
        onClose={() => setShowCommunication(false)}
        hustle={hustle}
        userType={isOwner ? 'poster' : 'worker'}
        otherUser={{
          name: isOwner ? 'Worker' : hustle.postedByName,
          email: isOwner ? 'worker@example.com' : 'poster@example.com',
          id: isOwner ? hustle.acceptedBy || '' : hustle.postedBy
        }}
      />

      {/* Payment Management Modal */}
      <PaymentManagementModal
        isOpen={showPaymentManagement}
        onClose={() => setShowPaymentManagement(false)}
        hustle={hustle}
      />
    </div>
  );
};

export default HustleCard;