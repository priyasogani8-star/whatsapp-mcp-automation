/**
 * Automation Validator - Validate all automation features
 */
import { CreateReactionRequest, SendStickerRequest, CreateStatusRequest, CreateEventRequest, ShareLocationRequest, SendMentionRequest } from '../types/index';
export declare class AutomationValidator {
    /**
     * Validate reaction request
     */
    validateReaction(request: CreateReactionRequest): void;
    /**
     * Validate sticker request
     */
    validateSticker(request: SendStickerRequest): void;
    /**
     * Validate status request
     */
    validateStatus(request: CreateStatusRequest): void;
    /**
     * Validate event request
     */
    validateEvent(request: CreateEventRequest): void;
    /**
     * Validate location request
     */
    validateLocation(request: ShareLocationRequest): void;
    /**
     * Validate mention request
     */
    validateMention(request: SendMentionRequest): void;
}
//# sourceMappingURL=automationValidator.d.ts.map