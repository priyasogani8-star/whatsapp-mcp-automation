/**
 * Poll Types - Support for single-choice and multiple-choice polls
 */
export type PollType = 'single' | 'multiple';
export interface PollChoice {
    id: string;
    text: string;
    emoji?: string;
}
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
export interface MultipleChoicePoll {
    id: string;
    type: 'multiple';
    question: string;
    choices: PollChoice[];
    minSelections: number;
    maxSelections: number;
    createdAt: Date;
    expiresAt?: Date;
    createdBy: string;
    groupJid?: string;
    status: 'active' | 'closed';
}
export type Poll = SingleChoicePoll | MultipleChoicePoll;
export interface UserVote {
    pollId: string;
    userId: string;
    userPhone: string;
    selectedChoices: string[];
    pollType: PollType;
    votedAt: Date;
    updatedAt?: Date;
}
export interface VoteChangeHistory {
    pollId: string;
    userId: string;
    previousVotes: string[];
    newVotes: string[];
    changedAt: Date;
    changeReason?: string;
}
export interface PollResult {
    pollId: string;
    question: string;
    pollType: PollType;
    totalVotes: number;
    totalParticipants: number;
    choices: ChoiceResult[];
    lastUpdated: Date;
    mostSelected?: string;
    leastSelected?: string;
}
export interface ChoiceResult {
    id: string;
    text: string;
    voteCount: number;
    percentage: number;
    voters?: string[];
}
export interface CreatePollRequest {
    question: string;
    choices: string[] | PollChoice[];
    pollType: 'single' | 'multiple';
    minSelections?: number;
    maxSelections?: number;
    expiresAt?: Date;
    groupJid?: string;
    isPublic?: boolean;
}
export interface VoteRequest {
    pollId: string;
    userId: string;
    userPhone: string;
    selectedChoices: string[];
}
export interface ChangeVoteRequest {
    pollId: string;
    userId: string;
    newSelectedChoices: string[];
}
//# sourceMappingURL=poll.types.d.ts.map