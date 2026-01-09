
export enum UserRole {
  FISHERMAN = 'FISHERMAN',
  NGO = 'NGO',
  ADMIN = 'ADMIN',
  CORPORATE = 'CORPORATE'
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  AI_VERIFIED = 'AI_VERIFIED',
  NGO_APPROVED = 'NGO_APPROVED', // New: Passed NGO review
  FIELD_CHECK_REQUIRED = 'FIELD_CHECK_REQUIRED', // New: Flagged for site visit
  APPROVED = 'APPROVED', // Final: Admin/Gov Issued
  REJECTED = 'REJECTED'
}

export enum CreditStatus {
  PENDING_ISSUANCE = 'PENDING_ISSUANCE', // New: Waiting for Admin
  AVAILABLE = 'AVAILABLE',
  FROZEN = 'FROZEN', // New: Compliance hold
  SOLD = 'SOLD',
  RETIRED = 'RETIRED'
}

export type Language = 'en' | 'es' | 'hi' | 'id';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  targetId: string;
  details: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  region?: string;
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
  adminComments?: string;
  creditId?: string;
  ngoId?: string;
  ngoName?: string;
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
  issuedBy?: string; // Admin name
}

export interface AppState {
  currentUser: User | null;
  submissions: Submission[];
  credits: CarbonCredit[];
  auditLogs: AuditLog[];
  language: Language;
  userCount: number;
}
