import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { Hustle } from '../types';
import { PaymentService } from '../services/paymentService';

interface PaymentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  hustle: Hustle;
}

const PaymentManagementModal: React.FC<PaymentManagementModalProps> = ({
  isOpen,
  onClose,
  hustle
}) => {
  const [markingPayment, setMarkingPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  if (!isOpen) return null;

  const handleMarkPaymentCompleted = async () => {
    if (!hustle.acceptedBy) return;
    
    setMarkingPayment(true);
    try {
      console.log('PaymentManagementModal: Marking payment completed for hustle:', hustle.id);
      await PaymentService.markPaymentCompleted(hustle.id, hustle.acceptedBy, hustle.amount);
      console.log('PaymentManagementModal: Payment marked as completed successfully');
      setPaymentCompleted(true);
    } catch (error) {
      console.error('PaymentManagementModal: Error marking payment completed:', error);
    } finally {
      setMarkingPayment(false);
    }
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
            <CheckCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Payment Management</h2>
          <p className="text-gray-400 text-sm">
            {hustle.title}
          </p>
        </div>

        {/* Work Details */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-3">Work Details</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p><strong>Amount:</strong> ₹{hustle.amount}</p>
            <p><strong>Status:</strong> {hustle.status}</p>
            <p><strong>Worker:</strong> {hustle.acceptedBy ? 'Assigned' : 'Not assigned'}</p>
            {hustle.deadline && (
              <p><strong>Deadline:</strong> {new Date(hustle.deadline).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        {/* Payment Status */}
        {paymentCompleted ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-green-400 mb-2">Payment Completed!</h3>
            <p className="text-gray-400 text-sm mb-4">
              The worker has been paid ₹{hustle.amount} and their profile has been updated.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertCircle size={16} className="text-yellow-400 mr-2" />
                <h3 className="text-yellow-400 font-medium">Payment Pending</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Mark this payment as completed once you have paid the worker ₹{hustle.amount}.
              </p>
            </div>

            <button
              onClick={handleMarkPaymentCompleted}
              disabled={markingPayment || !hustle.acceptedBy}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30 disabled:cursor-not-allowed"
            >
              {markingPayment ? 'Marking Payment...' : 'Mark Payment as Completed'}
            </button>

            {!hustle.acceptedBy && (
              <p className="text-gray-400 text-sm text-center">
                No worker has accepted this hustle yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagementModal;
