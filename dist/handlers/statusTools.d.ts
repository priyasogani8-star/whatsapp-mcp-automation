/**
 * Status Tools - Create and manage WhatsApp status updates
 */
import { CreateStatusRequest, StatusPost, StatusViewStats } from '../types/status.types';
export declare class StatusTools {
    private statusPosts;
    private viewStats;
    /**
     * Create new status post
     */
    createStatus(request: CreateStatusRequest): Promise<StatusPost>;
    /**
     * View status (track view)
     */
    viewStatus(statusId: string, viewerId: string): Promise<void>;
    /**
     * Add reaction to status
     */
    addReaction(statusId: string, emoji: string, userId: string): Promise<void>;
    /**
     * Get status view statistics
     */
    getViewStats(statusId: string): Promise<StatusViewStats>;
    /**
     * Schedule status post
     */
    scheduleStatus(request: CreateStatusRequest, scheduleTime: Date): Promise<StatusPost>;
    /**
     * Delete status
     */
    deleteStatus(statusId: string): Promise<void>;
}
//# sourceMappingURL=statusTools.d.ts.map