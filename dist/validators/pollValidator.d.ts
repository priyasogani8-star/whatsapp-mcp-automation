/**
 * Poll Validator - Validates all poll operations with security checks
 */
import { SingleChoicePoll, MultipleChoicePoll, CreatePollRequest, VoteRequest } from '../types/poll.types';
export declare class PollValidator {
    /**
     * VALIDATE POLL CREATION
     */
    validatePollCreation(request: CreatePollRequest): void;
    /**
     * VALIDATE SINGLE-CHOICE VOTE
     */
    validateSingleChoiceVote(request: VoteRequest, poll: SingleChoicePoll): void;
    /**
     * VALIDATE MULTIPLE-CHOICE VOTE
     */
    validateMultipleChoiceVote(request: VoteRequest, poll: MultipleChoicePoll): void;
    /**
     * VALIDATE MULTIPLE-CHOICE CONSTRAINTS
     */
    validateMultipleChoiceConstraints(poll: MultipleChoicePoll): void;
    /**
     * VALIDATE USER DATA
     */
    private validateUserData;
    /**
     * SANITIZE INPUT - Prevent XSS
     */
    private sanitizeInput;
    /**
     * VALIDATE NO XSS
     */
    private validateNoXSS;
}
//# sourceMappingURL=pollValidator.d.ts.map