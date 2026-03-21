/**
 * Poll Types - Support for single-choice and multiple-choice polls
 */

export type PollType = 'single' | 'multiple';

export interface PollChoice {
  id: string;
  text: string;
  emoji?: string;
}

// ============= SINGLE-CHOICE POLL =============
export interface SingleChoicePoll {
  id: string;
  type: 'single';
  question: string;
  choices: PollChoice[];
  createdAt: Date;
  expiresAt?: Date;
  createdBy: string;
  groupJid?: string;
  status: 'active' | 'closed';
}

// ============= MULTIPLE-CHOICE POLL =============
export interface MultipleChoicePoll {
  id: string;
  type: 'multiple';
  question: string;
  choices: PollChoice[];
  minSelections: number; // Minimum options user must select (default: 1)
  maxSelections: number; // Maximum options user can select
  createdAt: Date;
  expiresAt?: Date;
  createdBy: string;
  groupJid?: string;
  status: 'active' | 'closed';
}

// Union type for both poll types
export type Poll = SingleChoicePoll | MultipleChoicePoll;

// ============= USER VOTES =============
export interface UserVote {
  pollId: string;
  userId: string;
  userPhone: string;
  selectedChoices: string[]; // Array of choice IDs
  pollType: PollType;
  votedAt: Date;
  updatedAt?: Date;
}

// ============= VOTE CHANGE HISTORY =============
export interface VoteChangeHistory {
  pollId: string;
  userId: string;
  previousVotes: string[];
  newVotes: string[];
  changedAt: Date;
  changeReason?: string;
}

// ============= POLL RESULTS =============
export interface PollResult {
  pollId: string;
  question: string;
  pollType: PollType;
  totalVotes: number;
  totalParticipants: number;
  choices: ChoiceResult[];
  lastUpdated: Date;
  mostSelected?: string; // Choice ID with most votes
  leastSelected?: string; // Choice ID with least votes
}

export interface ChoiceResult {
  id: string;
  text: string;
  voteCount: number;
  percentage: number;
  voters?: string[]; // User IDs (if public poll)
}

// ============= POLL CREATION REQUEST =============
export interface CreatePollRequest {
  question: string;
  choices: string[] | PollChoice[];
  pollType: 'single' | 'multiple';
  minSelections?: number; // Only for multiple-choice
  maxSelections?: number; // Only for multiple-choice
  expiresAt?: Date;
  groupJid?: string;
  isPublic?: boolean; // If true, show voter names
}

// ============= VOTE REQUEST =============
export interface VoteRequest {
  pollId: string;
  userId: string;
  userPhone: string;
  selectedChoices: string[]; // Array of choice IDs
}

// ============= CHANGE VOTE REQUEST =============
export interface ChangeVoteRequest {
  pollId: string;
  userId: string;
  newSelectedChoices: string[];
}