/**
 * Poll Handler - Core business logic for single and multiple-choice polls
 */
import { Poll, UserVote, PollResult, CreatePollRequest, VoteRequest, ChangeVoteRequest } from '../types/poll.types';
import { PollDatabase } from '../storage/pollDatabase';
export declare class PollHandler {
    private db;
    private validator;
    constructor(database: PollDatabase);
    /**
     * CREATE POLL - Supports both single-choice and multiple-choice
     */
    createPoll(request: CreatePollRequest): Promise<Poll>;
    /**
     * VOTE ON POLL - Works for both single and multiple-choice
     */
    votePoll(request: VoteRequest): Promise<void>;
    /**
     * CHANGE VOTE - Works for both types
     * Single-choice: Replaces old vote with new vote
     * Multiple-choice: Updates selection set (can add/remove)
     */
    changeVote(request: ChangeVoteRequest): Promise<void>;
    /**
     * GET POLL RESULTS
     */
    getPollResults(pollId: string): Promise<PollResult>;
    /**
     * CLOSE POLL - No more votes allowed
     */
    closePoll(pollId: string): Promise<void>;
    /**
     * LIST ALL POLLS
     */
    listPolls(groupJid?: string): Promise<Poll[]>;
    /**
     * GET USER'S VOTE
     */
    getUserVote(pollId: string, userId: string): Promise<UserVote | null>;
    /**
     * Helper: Format choices from string array or PollChoice array
     */
    private formatChoices;
}
//# sourceMappingURL=pollHandler.d.ts.map