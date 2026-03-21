/**
 * Poll Validator - Validates all poll operations with security checks
 */

import {
  Poll,
  SingleChoicePoll,
  MultipleChoicePoll,
  CreatePollRequest,
  VoteRequest,
} from '../types/poll.types';

export class PollValidator {
  /**
   * VALIDATE POLL CREATION
   */
  validatePollCreation(request: CreatePollRequest): void {
    // Validate question
    if (!request.question || typeof request.question !== 'string') {
      throw new Error('Question is required and must be a string');
    }

    const sanitizedQuestion = this.sanitizeInput(request.question);
    if (sanitizedQuestion.length < 5 || sanitizedQuestion.length > 1000) {
      throw new Error('Question must be between 5 and 1000 characters');
    }

    // Validate choices
    if (!request.choices || request.choices.length === 0) {
      throw new Error('At least 2 choices are required');
    }

    if (request.choices.length > 10) {
      throw new Error('Maximum 10 choices allowed');
    }

    // Validate each choice
    request.choices.forEach((choice, index) => {
      const text = typeof choice === 'string' ? choice : choice.text;
      if (!text || text.trim().length === 0) {
        throw new Error(`Choice ${index + 1} cannot be empty`);
      }

      if (text.length > 100) {
        throw new Error(`Choice ${index + 1} exceeds 100 character limit`);
      }

      this.validateNoXSS(text);
    });

    // Validate poll type
    if (!['single', 'multiple'].includes(request.pollType)) {
      throw new Error('Poll type must be "single" or "multiple"');
    }

    // Validate multiple-choice specific constraints
    if (request.pollType === 'multiple') {
      const min = request.minSelections || 1;
      const max = request.maxSelections || 3;

      if (min < 1) {
        throw new Error('minSelections must be at least 1');
      }

      if (max > request.choices.length) {
        throw new Error('maxSelections cannot exceed total choices');
      }

      if (min > max) {
        throw new Error('minSelections cannot be greater than maxSelections');
      }
    }

    // Validate expiry date
    if (request.expiresAt && request.expiresAt <= new Date()) {
      throw new Error('Expiry date must be in the future');
    }
  }

  /**
   * VALIDATE SINGLE-CHOICE VOTE
   */
  validateSingleChoiceVote(request: VoteRequest, poll: SingleChoicePoll): void {
    // Must select exactly 1 choice
    if (!request.selectedChoices || request.selectedChoices.length !== 1) {
      throw new Error('Single-choice poll requires exactly 1 selection');
    }

    const selectedChoiceId = request.selectedChoices[0];

    // Choice must exist in poll
    const choiceExists = poll.choices.some((c) => c.id === selectedChoiceId);
    if (!choiceExists) {
      throw new Error(`Choice ${selectedChoiceId} does not exist in this poll`);
    }

    // Validate user data
    this.validateUserData(request);
  }

  /**
   * VALIDATE MULTIPLE-CHOICE VOTE
   */
  validateMultipleChoiceVote(request: VoteRequest, poll: MultipleChoicePoll): void {
    const selectionCount = request.selectedChoices?.length || 0;

    // Check min selections
    if (selectionCount < poll.minSelections) {
      throw new Error(
        `Must select at least ${poll.minSelections} option(s). You selected ${selectionCount}.`
      );
    }

    // Check max selections
    if (selectionCount > poll.maxSelections) {
      throw new Error(
        `Cannot select more than ${poll.maxSelections} option(s). You selected ${selectionCount}.`
      );
    }

    // All choices must exist
    request.selectedChoices.forEach((choiceId) => {
      const choiceExists = poll.choices.some((c) => c.id === choiceId);
      if (!choiceExists) {
        throw new Error(`Choice ${choiceId} does not exist in this poll`);
      }
    });

    // Check for duplicate selections
    const uniqueSelections = new Set(request.selectedChoices);
    if (uniqueSelections.size !== request.selectedChoices.length) {
      throw new Error('Duplicate selections are not allowed');
    }

    // Validate user data
    this.validateUserData(request);
  }

  /**
   * VALIDATE MULTIPLE-CHOICE CONSTRAINTS
   */
  validateMultipleChoiceConstraints(poll: MultipleChoicePoll): void {
    if (poll.minSelections < 1) {
      throw new Error('minSelections must be at least 1');
    }

    if (poll.maxSelections > poll.choices.length) {
      throw new Error('maxSelections cannot exceed total number of choices');
    }

    if (poll.minSelections > poll.maxSelections) {
      throw new Error('minSelections cannot be greater than maxSelections');
    }
  }

  /**
   * VALIDATE USER DATA
   */
  private validateUserData(request: VoteRequest): void {
    if (!request.userId || typeof request.userId !== 'string') {
      throw new Error('Valid userId is required');
    }

    if (!request.userPhone || typeof request.userPhone !== 'string') {
      throw new Error('Valid userPhone is required');
    }

    // Validate phone format (basic)
    if (!/^\d{10,15}$/.test(request.userPhone.replace(/[+\s\-()]/g, ''))) {
      throw new Error('Invalid phone number format');
    }
  }

  /**
   * SANITIZE INPUT - Prevent XSS
   */
  private sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';

    return input
      .trim()
      .slice(0, 1000) // Limit length
      .replace(/[<>\"'`]/g, '') // Remove dangerous characters
      .replace(/\x00/g, ''); // Remove null bytes
  }

  /**
   * VALIDATE NO XSS
   */
  private validateNoXSS(input: string): void {
    const xssPatterns = [/<script|<iframe|<img|onerror=|onclick=|javascript:/i];

    if (xssPatterns.some((pattern) => pattern.test(input))) {
      throw new Error('Input contains potentially malicious content');
    }
  }
}