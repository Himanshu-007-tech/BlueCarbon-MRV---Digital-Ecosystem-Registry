
export enum UserRole {
  FISHERMAN = 'FISHERMAN',
  NGO = 'NGO',
  ADMIN = 'ADMIN',
  CORPORATE = 'CORPORATE'
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  AI_VERIFIED = 'AI_VERIFIED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum CreditStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
  RETIRED = 'RETIRED'
}

export type Language = 'en' | 'es' | 'hi' | 'id';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
}

export interface Submission {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
    region: string;
  };
  ecosystemType: 'MANGROVE' | 'SEAGRASS';
  status: SubmissionStatus;
  aiScore: number;
  aiAnalysis?: string;
  estimatedArea: number; 
  estimatedCarbon: number; 
  verifierComments?: string;
  creditId?: string;
}

export interface CarbonCredit {
  id: string;
  submissionId: string;
  origin: string; 
  region: string;
  ownerId: string;
  ownerName: string;
  tons: number;
  status: CreditStatus;
  mintedAt: string;
  transactionHash: string;
}

export interface AppState {
  currentUser: User | null;
  submissions: Submission[];
  credits: CarbonCredit[];
  language: Language;
  userCount: number;
}
