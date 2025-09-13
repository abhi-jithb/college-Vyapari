export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  department?: string;
  year?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  totalRatings?: number;
  completedHustles?: number;
  totalEarned?: number;
}

export interface Hustle {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline?: string;
  postedBy: string;
  postedByName: string;
  postedByDepartment?: string;
  college: string;
  status: 'open' | 'accepted' | 'completed';
  acceptedBy?: string;
  createdAt: string;
  paymentCompleted?: boolean;
  paymentCompletedAt?: string;
}

export interface UserHustle extends Hustle {
  type: 'posted' | 'accepted';
}

export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  hustleId: string;
  rating: number;
  review?: string;
  createdAt: string;
}