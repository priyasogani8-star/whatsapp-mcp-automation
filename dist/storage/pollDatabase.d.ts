/**
 * Poll Database - SQLite backend for poll storage and management
 */
import { Poll, UserVote, VoteChangeHistory } from '../types/poll.types';
export declare class PollDatabase {
    private db;
    constructor(dbPath?: string);
    /**
     * INITIALIZE DATABASE SCHEMA
     */
    private initializeSchema;
    /**
     * SAVE POLL
     */
    savePoll(poll: Poll): Promise<void>;
    /**
     * GET POLL
     */
    getPoll(pollId: string): Promise<Poll | null>;
    /**
     * SAVE VOTE
     */
    saveVote(vote: UserVote): Promise<void>;
    /**
     * GET USER VOTE
     */
    getUserVote(pollId: string, userId: string): Promise<UserVote | null>;
    /**
     * UPDATE VOTE
     */
    updateVote(vote: UserVote): Promise<void>;
    /**
     * GET POLL VOTES
     */
    getPollVotes(pollId: string): Promise<UserVote[]>;
    /**
     * SAVE VOTE CHANGE HISTORY
     */
    saveVoteChangeHistory(history: VoteChangeHistory): Promise<void>;
    /**
     * UPDATE POLL STATUS
     */
    updatePollStatus(pollId: string, status: 'active' | 'closed'): Promise<void>;
    /**
     * LIST POLLS
     */
    listPolls(groupJid?: string): Promise<Poll[]>;
    /**
     * DELETE EXPIRED POLLS (Cleanup)
     */
    deleteExpiredPolls(): Promise<number>;
    /**
     * CLOSE DATABASE
     */
    close(): void;
}
//# sourceMappingURL=pollDatabase.d.ts.map