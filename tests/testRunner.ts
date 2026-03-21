/**
 * ==========================================
 * COMPREHENSIVE TEST SUITE FOR POLL VOTING
 * ==========================================
 * Tests for both Single-Choice and Multiple-Choice Polls
 * 
 * RUNNING TESTS:
 * npm test
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { v4 as uuid } from 'uuid';

// ============================================================
// MOCK IMPLEMENTATIONS FOR TESTING
// ============================================================

interface PollChoice {
  id: string;
  text: string;
}

interface SingleChoicePoll {
  id: string;
  type: 'single';
  question: string;
  choices: PollChoice[];
  status: 'active' | 'closed';
}

interface MultipleChoicePoll {
  id: string;
  type: 'multiple';
  question: string;
  choices: PollChoice[];
  minSelections: number;
  maxSelections: number;
  status: 'active' | 'closed';
}

type Poll = SingleChoicePoll | MultipleChoicePoll;

interface UserVote {
  pollId: string;
  userId: string;
  userPhone: string;
  selectedChoices: string[];
  pollType: 'single' | 'multiple';
  votedAt: Date;
}

// In-Memory Storage for Testing
const pollsStorage = new Map<string, Poll>();
const votesStorage = new Map<string, UserVote[]>();

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function createSingleChoicePoll(question: string, choices: string[]): SingleChoicePoll {
  const poll: SingleChoicePoll = {
    id: uuid(),
    type: 'single',
    question,
    choices: choices.map((text, index) => ({
      id: `choice_${index + 1}`,
      text,
    })),
    status: 'active',
  };
  pollsStorage.set(poll.id, poll);
  return poll;
}

function createMultipleChoicePoll(
  question: string,
  choices: string[],
  minSelections: number = 1,
  maxSelections: number = 3
): MultipleChoicePoll {
  const poll: MultipleChoicePoll = {
    id: uuid(),
    type: 'multiple',
    question,
    choices: choices.map((text, index) => ({
      id: `choice_${index + 1}`,
      text,
    })),
    minSelections,
    maxSelections,
    status: 'active',
  };
  pollsStorage.set(poll.id, poll);
  return poll;
}

function voteOnPoll(
  pollId: string,
  userId: string,
  userPhone: string,
  selectedChoices: string[]
): { success: boolean; error?: string } {
  const poll = pollsStorage.get(pollId);
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }

  // Check if user already voted
  const existingVotes = votesStorage.get(pollId) || [];
  if (existingVotes.some((v) => v.userId === userId)) {
    return { success: false, error: 'User already voted. Use changeVote to modify' };
  }

  // Validate based on poll type
  if (poll.type === 'single') {
    if (selectedChoices.length !== 1) {
      return { success: false, error: 'Single-choice poll requires exactly 1 selection' };
    }
  } else {
    if (selectedChoices.length < poll.minSelections) {
      return {
        success: false,
        error: `Must select at least ${poll.minSelections} option(s)`,
      };
    }
    if (selectedChoices.length > poll.maxSelections) {
      return {
        success: false,
        error: `Cannot select more than ${poll.maxSelections} option(s)`,
      };
    }
  }

  // Validate all choices exist
  const validChoiceIds = new Set(poll.choices.map((c) => c.id));
  for (const choiceId of selectedChoices) {
    if (!validChoiceIds.has(choiceId)) {
      return { success: false, error: `Invalid choice: ${choiceId}` };
    }
  }

  // Save vote
  const vote: UserVote = {
    pollId,
    userId,
    userPhone,
    selectedChoices,
    pollType: poll.type,
    votedAt: new Date(),
  };

  if (!votesStorage.has(pollId)) {
    votesStorage.set(pollId, []);
  }
  votesStorage.get(pollId)!.push(vote);

  return { success: true };
}

function changeVote(
  pollId: string,
  userId: string,
  newSelectedChoices: string[]
): { success: boolean; error?: string } {
  const poll = pollsStorage.get(pollId);
  if (!poll) {
    return { success: false, error: 'Poll not found' };
  }

  const existingVotes = votesStorage.get(pollId) || [];
  const userVoteIndex = existingVotes.findIndex((v) => v.userId === userId);

  if (userVoteIndex === -1) {
    return { success: false, error: 'User has not voted yet' };
  }

  // Validate new vote
  if (poll.type === 'single') {
    if (newSelectedChoices.length !== 1) {
      return { success: false, error: 'Single-choice poll requires exactly 1 selection' };
    }
  } else {
    if (newSelectedChoices.length < poll.minSelections) {
      return {
        success: false,
        error: `Must select at least ${poll.minSelections} option(s)`,
      };
    }
    if (newSelectedChoices.length > poll.maxSelections) {
      return {
        success: false,
        error: `Cannot select more than ${poll.maxSelections} option(s)`,
      };
    }
  }

  // Update vote
  existingVotes[userVoteIndex].selectedChoices = newSelectedChoices;
  return { success: true };
}

function getPollResults(pollId: string) {
  const poll = pollsStorage.get(pollId);
  if (!poll) return null;

  const votes = votesStorage.get(pollId) || [];
  const choiceVoteCounts = new Map<string, number>();

  poll.choices.forEach((choice) => {
    choiceVoteCounts.set(choice.id, 0);
  });

  votes.forEach((vote) => {
    vote.selectedChoices.forEach((choiceId) => {
      choiceVoteCounts.set(choiceId, (choiceVoteCounts.get(choiceId) || 0) + 1);
    });
  });

  return {
    pollId,
    question: poll.question,
    pollType: poll.type,
    totalVotes: votes.length,
    choices: poll.choices.map((choice) => ({
      id: choice.id,
      text: choice.text,
      voteCount: choiceVoteCounts.get(choice.id) || 0,
    })),
  };
}

// ============================================================
// TESTS START HERE
// ============================================================

describe('🗳️  SINGLE-CHOICE POLL TESTS', () => {
  beforeEach(() => {
    pollsStorage.clear();
    votesStorage.clear();
  });

  it('✅ Should create a single-choice poll', () => {
    const poll = createSingleChoicePoll('Where should we eat?', ['Pizza', 'Sushi', 'Burger']);

    expect(poll.type).toBe('single');
    expect(poll.question).toBe('Where should we eat?');
    expect(poll.choices.length).toBe(3);
  });

  it('✅ Should allow user to vote once on single-choice', () => {
    const poll = createSingleChoicePoll('Pick a color', ['Red', 'Blue', 'Green']);

    const result = voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1']);

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('❌ Should reject multiple selections on single-choice', () => {
    const poll = createSingleChoicePoll('Pick ONE color', ['Red', 'Blue', 'Green']);

    const result = voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1', 'choice_2']);

    expect(result.success).toBe(false);
    expect(result.error).toContain('exactly 1 selection');
  });

  it('✅ Should allow vote change on single-choice (replaces old vote)', () => {
    const poll = createSingleChoicePoll('Restaurant?', ['Pizza', 'Sushi', 'Burger']);

    // User votes for Pizza
    voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1']);

    // User changes vote to Sushi
    const changeResult = changeVote(poll.id, 'user1', ['choice_2']);

    expect(changeResult.success).toBe(true);

    const votes = votesStorage.get(poll.id)!;
    expect(votes[0].selectedChoices).toEqual(['choice_2']);
  });

  it('❌ Should prevent duplicate votes without change', () => {
    const poll = createSingleChoicePoll('Choose', ['A', 'B', 'C']);

    voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1']);

    const result = voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_2']);

    expect(result.success).toBe(false);
    expect(result.error).toContain('already voted');
  });

  it('✅ Should calculate results correctly for single-choice', () => {
    const poll = createSingleChoicePoll('Best language?', ['JavaScript', 'Python', 'Go']);

    voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1']); // JavaScript
    voteOnPoll(poll.id, 'user2', '+91-9876543211', ['choice_2']); // Python
    voteOnPoll(poll.id, 'user3', '+91-9876543212', ['choice_1']); // JavaScript

    const results = getPollResults(poll.id);

    expect(results!.totalVotes).toBe(3);
    expect(results!.choices[0].voteCount).toBe(2); // JavaScript: 2 votes
    expect(results!.choices[1].voteCount).toBe(1); // Python: 1 vote
  });
});

describe('🗳️  MULTIPLE-CHOICE POLL TESTS', () => {
  beforeEach(() => {
    pollsStorage.clear();
    votesStorage.clear();
  });

  it('✅ Should create a multiple-choice poll with constraints', () => {
    const poll = createMultipleChoicePoll(
      'What properties do you like?',
      ['1 BHK', '2 BHK', '3 BHK', '4 BHK'],
      1,
      3
    );

    expect(poll.type).toBe('multiple');
    expect(poll.minSelections).toBe(1);
    expect(poll.maxSelections).toBe(3);
  });

  it('✅ Should allow multiple selections', () => {
    const poll = createMultipleChoicePoll(
      'Select skills',
      ['JavaScript', 'Python', 'Go', 'Rust'],
      1,
      3
    );

    const result = voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1', 'choice_2']);

    expect(result.success).toBe(true);
  });

  it('❌ Should reject if below minSelections', () => {
    const poll = createMultipleChoicePoll(
      'Select at least 2',
      ['A', 'B', 'C', 'D'],
      2,
      3
    );

    const result = voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1']);

    expect(result.success).toBe(false);
    expect(result.error).toContain('at least 2');
  });

  it('❌ Should reject if above maxSelections', () => {
    const poll = createMultipleChoicePoll(
      'Select max 2',
      ['A', 'B', 'C', 'D'],
      1,
      2
    );

    const result = voteOnPoll(poll.id, 'user1', '+91-9876543210', [
      'choice_1',
      'choice_2',
      'choice_3',
    ]);

    expect(result.success).toBe(false);
    expect(result.error).toContain('more than 2');
  });

  it('✅ Should allow adding selections on vote change', () => {
    const poll = createMultipleChoicePoll(
      'Select properties',
      ['Pool', 'Gym', 'Garden', 'Parking'],
      1,
      3
    );

    voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1', 'choice_2']); // Pool, Gym

    const changeResult = changeVote(poll.id, 'user1', ['choice_1', 'choice_2', 'choice_3']); // Add Garden

    expect(changeResult.success).toBe(true);

    const votes = votesStorage.get(poll.id)!;
    expect(votes[0].selectedChoices.length).toBe(3);
  });

  it('✅ Should allow removing selections on vote change', () => {
    const poll = createMultipleChoicePoll(
      'Languages',
      ['English', 'Spanish', 'French', 'German'],
      1,
      3
    );

    voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1', 'choice_2', 'choice_3']);

    const changeResult = changeVote(poll.id, 'user1', ['choice_1', 'choice_3']); // Remove Spanish

    expect(changeResult.success).toBe(true);

    const votes = votesStorage.get(poll.id)!;
    expect(votes[0].selectedChoices.length).toBe(2);
    expect(votes[0].selectedChoices).toEqual(['choice_1', 'choice_3']);
  });

  it('✅ Should calculate results for multiple-choice', () => {
    const poll = createMultipleChoicePoll(
      'Amenities wanted',
      ['Pool', 'Gym', 'Garden', 'Parking'],
      1,
      3
    );

    voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1', 'choice_2']); // Pool, Gym
    voteOnPoll(poll.id, 'user2', '+91-9876543211', ['choice_2', 'choice_3', 'choice_4']); // Gym, Garden, Parking

    const results = getPollResults(poll.id);

    expect(results!.totalVotes).toBe(2);
    expect(results!.choices[0].voteCount).toBe(1); // Pool: 1
    expect(results!.choices[1].voteCount).toBe(2); // Gym: 2
    expect(results!.choices[2].voteCount).toBe(1); // Garden: 1
    expect(results!.choices[3].voteCount).toBe(1); // Parking: 1
  });

  it('❌ Should prevent removing all selections below minSelections', () => {
    const poll = createMultipleChoicePoll(
      'Test',
      ['A', 'B', 'C'],
      2,
      3 // Minimum 2 selections required
    );

    voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1', 'choice_2']);

    const changeResult = changeVote(poll.id, 'user1', ['choice_1']); // Try to leave only 1 (below min of 2)

    expect(changeResult.success).toBe(false);
    expect(changeResult.error).toContain('at least 2');
  });
});

describe('🔄 VOTE CHANGE TESTS', () => {
  beforeEach(() => {
    pollsStorage.clear();
    votesStorage.clear();
  });

  it('✅ Single-Choice: Vote replacement works correctly', () => {
    const poll = createSingleChoicePoll('Restaurant', ['Pizza', 'Sushi', 'Burger']);

    voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1']); // Pizza
    changeVote(poll.id, 'user1', ['choice_2']); // Change to Sushi
    changeVote(poll.id, 'user1', ['choice_3']); // Change to Burger

    const votes = votesStorage.get(poll.id)!;
    expect(votes[0].selectedChoices).toEqual(['choice_3']);
  });

  it('✅ Multiple-Choice: Full replacement works correctly', () => {
    const poll = createMultipleChoicePoll('Fruits', ['Apple', 'Banana', 'Orange', 'Mango'], 1, 3);

    voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1', 'choice_2']); // Apple, Banana
    changeVote(poll.id, 'user1', ['choice_3', 'choice_4']); // Change to Orange, Mango

    const votes = votesStorage.get(poll.id)!;
    expect(votes[0].selectedChoices).toEqual(['choice_3', 'choice_4']);
  });

  it('❌ Cannot change vote for non-existent user', () => {
    const poll = createSingleChoicePoll('Choice', ['A', 'B']);

    const result = changeVote(poll.id, 'user_who_didnt_vote', ['choice_1']);

    expect(result.success).toBe(false);
    expect(result.error).toContain('not voted yet');
  });
});

describe('⚠️  EDGE CASES', () => {
  beforeEach(() => {
    pollsStorage.clear();
    votesStorage.clear();
  });

  it('✅ Single selection in multiple-choice (at minimum)', () => {
    const poll = createMultipleChoicePoll('Pick items', ['X', 'Y', 'Z'], 1, 3);

    const result = voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1']);

    expect(result.success).toBe(true);
  });

  it('✅ All options selected in multiple-choice', () => {
    const poll = createMultipleChoicePoll('All', ['A', 'B', 'C'], 1, 3);

    const result = voteOnPoll(poll.id, 'user1', '+91-9876543210', ['choice_1', 'choice_2', 'choice_3']);

    expect(result.success).toBe(true);
  });

  it('❌ Invalid choice ID rejected', () => {
    const poll = createSingleChoicePoll('Test', ['A', 'B']);

    const result = voteOnPoll(poll.id, 'user1', '+91-9876543210', ['invalid_choice']);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid choice');
  });

  it('❌ Non-existent poll rejected', () => {
    const result = voteOnPoll('fake_poll_id', 'user1', '+91-9876543210', ['choice_1']);

    expect(result.success).toBe(false);
    expect(result.error).toContain('not found');
  });
});