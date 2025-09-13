import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Hustle } from '../types';
import { HustleService } from '../services/hustleService';
import { useAuth } from './AuthContext';

interface HustleContextType {
  hustles: Hustle[];
  addHustle: (hustle: Omit<Hustle, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  acceptHustle: (hustleId: string, userId: string) => Promise<void>;
  completeHustle: (hustleId: string) => Promise<void>;
  getUserHustles: (userId: string) => Promise<{ posted: Hustle[]; accepted: Hustle[] }>;
  refreshHustles: () => Promise<void>;
}

const HustleContext = createContext<HustleContextType | undefined>(undefined);

export const useHustle = () => {
  const context = useContext(HustleContext);
  if (context === undefined) {
    throw new Error('useHustle must be used within a HustleProvider');
  }
  return context;
};

interface HustleProviderProps {
  children: ReactNode;
}

export const HustleProvider: React.FC<HustleProviderProps> = ({ children }) => {
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.college) {
      console.log('HustleContext: Subscribing to hustles for college:', user.college);
      // Subscribe to real-time updates for college hustles
      const unsubscribe = HustleService.subscribeToCollegeHustles(user.college, (hustles) => {
        console.log('HustleContext: Received hustles update:', hustles.length, 'hustles');
        console.log('HustleContext: Hustles data:', hustles);
        setHustles(hustles);
      });

      return () => {
        console.log('HustleContext: Unsubscribing from hustles');
        unsubscribe();
      };
    } else {
      console.log('HustleContext: No user college, clearing hustles');
      setHustles([]);
    }
  }, [user?.college]);

  const addHustle = async (hustleData: Omit<Hustle, 'id' | 'createdAt' | 'status'>) => {
    try {
      console.log('HustleContext: Adding hustle with data:', hustleData);
      await HustleService.addHustle(hustleData);
      console.log('HustleContext: Hustle added successfully');
      // The real-time listener will update the hustles state
    } catch (error) {
      console.error('HustleContext: Error adding hustle:', error);
      throw error;
    }
  };

  const acceptHustle = async (hustleId: string, userId: string) => {
    try {
      console.log('HustleContext: Accepting hustle:', { hustleId, userId });
      await HustleService.updateHustleStatus(hustleId, 'accepted', userId);
      console.log('HustleContext: Hustle accepted successfully');
      // The real-time listener will update the hustles state
    } catch (error) {
      console.error('HustleContext: Error accepting hustle:', error);
      throw error;
    }
  };

  const completeHustle = async (hustleId: string) => {
    try {
      await HustleService.updateHustleStatus(hustleId, 'completed');
      // The real-time listener will update the hustles state
    } catch (error) {
      console.error('Error completing hustle:', error);
      throw error;
    }
  };

  const getUserHustles = async (userId: string) => {
    try {
      return await HustleService.getUserHustles(userId);
    } catch (error) {
      console.error('Error getting user hustles:', error);
      return { posted: [], accepted: [] };
    }
  };

  const refreshHustles = async () => {
    if (user?.college) {
      try {
        console.log('HustleContext: Manually refreshing hustles for college:', user.college);
        const hustles = await HustleService.getHustlesByCollege(user.college);
        console.log('HustleContext: Manual refresh got', hustles.length, 'hustles');
        setHustles(hustles);
      } catch (error) {
        console.error('HustleContext: Error refreshing hustles:', error);
      }
    }
  };

  return (
    <HustleContext.Provider value={{ hustles, addHustle, acceptHustle, completeHustle, getUserHustles, refreshHustles }}>
      {children}
    </HustleContext.Provider>
  );
};