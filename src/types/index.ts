import { Entry, Settings } from '@prisma/client';

// Entry type constants (stored as strings in SQLite)
export const EntryType = {
  PRIMARY: 'PRIMARY',
  OVERFLOW: 'OVERFLOW',
  MANUAL: 'MANUAL',
} as const;

export type EntryType = (typeof EntryType)[keyof typeof EntryType];

// Entry status constants (stored as strings in SQLite)
export const EntryStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type EntryStatus = (typeof EntryStatus)[keyof typeof EntryStatus];

export type { Entry, Settings };

export interface RaffleStats {
  totalEntries: number;
  primaryEntriesCount: number;
  overflowEntriesCount: number;
  primaryRemaining: number;
  isPrimarySoldOut: boolean;
  isOverflowActive: boolean;
  overflowTimeRemaining: number | null;
  settings: Settings | null;
}

export interface CreateEntryRequest {
  name: string;
  email: string;
  phone: string;
  paymentIntentId: string;
}

export interface CreateEntryResponse {
  success: boolean;
  entry?: Entry;
  error?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export interface ManualEntryRequest {
  name: string;
  email: string;
  phone: string;
  amount: number; // in cents
  notes?: string;
}

export interface DrawWinnerResponse {
  success: boolean;
  winner?: Entry;
  error?: string;
}
