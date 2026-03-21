/**
 * Poll Handler - Core business logic for single and multiple-choice polls
 */

import { v4 as uuid } from 'uuid';
import {
  Poll,
  SingleChoicePoll,
  MultipleChoicePoll,
  UserVote,
  PollResult,
  CreatePollRequest,
  VoteRequest,
  ChangeVoteRequest,
  VoteChangeHistory,
} from '../types/poll.types';
import { PollDatabase } from '../storage/pollDatabase';
import { PollValidator } from '../validators/pollValidator';

export class PollHandler {
  private db: PollDatabase;
  private validator: PollValidator;

  constructor(database: PollDatabase) {
    this.db = database;
    this.validator = new PollValidator();
  }

  /**
   * CREATE POLL - Supports both single-choice and multiple-choice
   */
  async createPoll(request: CreatePollRequest): Promise<Poll> {
    // Validate request
    this.validator.validatePollCreation(request);

    const pollId = uuid();
    const now = new Date();

    if (request.pollType === 'single') {
      // Single-choice poll
      const poll: SingleChoicePoll = {
        id: pollId,
        type: 'single',
        question: request.question,
        choices: this.formatChoices(request.choices),
        createdAt: now,
        expiresAt: request.expiresAt,
        createdBy: request.groupJid || 'user',
        groupJid: request.groupJid,
        status: 'active',
      };

      await this.db.savePoll(poll);
      return poll;
    } else {
      // Multiple-choice poll
      const poll: MultipleChoicePoll = {
        id: pollId,
        type: 'multiple',
        question: request.question,
        choices: this.formatChoices(request.choices),
        minSelections: request.minSelections || 1,
        maxSelections: request.maxSelections || 3,
        createdAt: now,
        expiresAt: request.expiresAt,
        createdBy: request.groupJid || 'user',
        groupJid: request.groupJid,
        status: 'active',
      };

      // Validate constraints
      this.validator.validateMultipleChoiceConstraints(poll);

      await this.db.savePoll(poll);
      return poll;
    }
  }

  /**
   * VOTE ON POLL - Works for both single and multiple-choice
   */
  async votePoll(request: VoteRequest): Promise<void> {
    const poll = await this.db.getPoll(request.pollId);
    if (!poll) {
      throw new Error(`Poll ${request.pollId} not found`);
    }

    if (poll.status === 'closed') {
      throw new Error('Poll is closed. No more votes allowed');
    }

    if (poll.expiresAt && new Date() > poll.expiresAt) {
      throw new Error('Poll has expired');
    }

    // Check if user already voted
    const existingVote = await this.db.getUserVote(request.pollId, request.userId);
    if (existingVote) {
      throw new Error('User has already voted. Use changeVote() to modify vote');
    }

    // Validate vote based on poll type
    if (poll.type === 'single') {
      this.validator.validateSingleChoiceVote(request, poll);
    } else {
      this.validator.validateMultipleChoiceVote(request, poll);
    }

    // Save vote
    const vote: UserVote = {
      pollId: request.pollId,
      userId: request.userId,
      userPhone: request.userPhone,
      selectedChoices: request.selectedChoices,
      pollType: poll.type,
      votedAt: new Date(),
    };

    await this.db.saveVote(vote);
  }

  /**
   * CHANGE VOTE - Works for both types
   * Single-choice: Replaces old vote with new vote
   * Multiple-choice: Updates selection set (can add/remove)
   */
  async changeVote(request: ChangeVoteRequest): Promise<void> {
    const poll = await this.db.getPoll(request.pollId);
    if (!poll) {
      throw new Error(`Poll ${request.pollId} not found`);
    }

    if (poll.status === 'closed') {
      throw new Error('Poll is closed. Cannot change votes');
    }

    // Get existing vote
    const existingVote = await this.db.getUserVote(request.pollId, request.userId);
    if (!existingVote) {
      throw new Error('User has not voted yet. Use votePoll() to vote');
    }

    // Validate new vote based on poll type
    if (poll.type === 'single') {
      this.validator.validateSingleChoiceVote(
        {
          pollId: request.pollId,
          userId: request.userId,
          userPhone: existingVote.userPhone,
          selectedChoices: request.newSelectedChoices,
        },
        poll
      );
    } else {
      this.validator.validateMultipleChoiceVote(
        {
          pollId: request.pollId,
          userId: request.userId,
          userPhone: existingVote.userPhone,
          selectedChoices: request.newSelectedChoices,
        },
        poll
      );
    }

    // Save vote change history
    const history: VoteChangeHistory = {
      pollId: request.pollId,
      userId: request.userId,
      previousVotes: existingVote.selectedChoices,
      newVotes: request.newSelectedChoices,
      changedAt: new Date(),
    };

    await this.db.saveVoteChangeHistory(history);

    // Update vote
    existingVote.selectedChoices = request.newSelectedChoices;
    existingVote.updatedAt = new Date();

    await this.db.updateVote(existingVote);
  }

  /**
   * GET POLL RESULTS
   */
  async getPollResults(pollId: string): Promise<PollResult> {
    const poll = await this.db.getPoll(pollId);
    if (!poll) {
      throw new Error(`Poll ${pollId} not found`);
    }

    const votes = await this.db.getPollVotes(pollId);

    // Calculate results
    const choiceVoteCounts = new Map<string, number>();
    const choiceVoters = new Map<string, string[]>();

    poll.choices.forEach((choice) => {
      choiceVoteCounts.set(choice.id, 0);
      choiceVoters.set(choice.id, []);
    });

    votes.forEach((vote) => {
      vote.selectedChoices.forEach((choiceId) => {
        choiceVoteCounts.set(choiceId, (choiceVoteCounts.get(choiceId) || 0) + 1);
        choiceVoters.get(choiceId)?.push(vote.userId);
      });
    });

    const totalVotes = votes.length;
    const choiceResults = poll.choices.map((choice) => ({
      id: choice.id,
      text: choice.text,
      voteCount: choiceVoteCounts.get(choice.id) || 0,
      percentage: totalVotes > 0 ? ((choiceVoteCounts.get(choice.id) || 0) / totalVotes) * 100 : 0,
      voters: choiceVoters.get(choice.id),
    }));

    // Find most and least selected
    const sorted = [...choiceResults].sort((a, b) => b.voteCount - a.voteCount);
    const mostSelected = sorted[0]?.id;
    const leastSelected = sorted[sorted.length - 1]?.id;

    return {
      pollId,
      question: poll.question,
      pollType: poll.type,
      totalVotes,
      totalParticipants: votes.length,
      choices: choiceResults,
      lastUpdated: new Date(),
      mostSelected,
      leastSelected,
    };
  }

  /**
   * CLOSE POLL - No more votes allowed
   */
  async closePoll(pollId: string): Promise<void> {
    const poll = await this.db.getPoll(pollId);
    if (!poll) {
      throw new Error(`Poll ${pollId} not found`);
    }

    await this.db.updatePollStatus(pollId, 'closed');
  }

  /**
   * LIST ALL POLLS
   */
  async listPolls(groupJid?: string): Promise<Poll[]> {
    return await this.db.listPolls(groupJid);
  }

  /**
   * GET USER'S VOTE
   */
  async getUserVote(pollId: string, userId: string): Promise<UserVote | null> {
    return await this.db.getUserVote(pollId, userId);
  }

  /**
   * Helper: Format choices from string array or PollChoice array
   */
  private formatChoices(choices: string[] | any[]): any[] {
    if (!choices || choices.length === 0) {
      throw new Error('Poll must have at least 2 choices');
    }

    if (typeof choices[0] === 'string') {
      return (choices as string[]).map((text, index) => ({
        id: `choice_${index + 1}`,
        text,
      }));
    }

    return choices;
  }
}