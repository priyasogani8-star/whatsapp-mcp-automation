"use strict";
/**
 * Poll Database - SQLite backend for poll storage and management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollDatabase = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class PollDatabase {
    constructor(dbPath = './.data/polls.db') {
        this.db = new better_sqlite3_1.default(dbPath);
        this.initializeSchema();
    }
    /**
     * INITIALIZE DATABASE SCHEMA
     */
    initializeSchema() {
        // Create polls table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS polls (
        id TEXT PRIMARY KEY,
        question TEXT NOT NULL,
        pollType TEXT NOT NULL CHECK(pollType IN ('single', 'multiple')),
        choices JSON NOT NULL,
        minSelections INTEGER,
        maxSelections INTEGER,
        createdAt DATETIME NOT NULL,
        expiresAt DATETIME,
        createdBy TEXT,
        groupJid TEXT,
        status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'closed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS votes (
        id TEXT PRIMARY KEY,
        pollId TEXT NOT NULL,
        userId TEXT NOT NULL,
        userPhone TEXT NOT NULL,
        selectedChoices JSON NOT NULL,
        pollType TEXT NOT NULL,
        votedAt DATETIME NOT NULL,
        updatedAt DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(pollId, userId),
        FOREIGN KEY(pollId) REFERENCES polls(id)
      );

      CREATE TABLE IF NOT EXISTS vote_change_history (
        id TEXT PRIMARY KEY,
        pollId TEXT NOT NULL,
        userId TEXT NOT NULL,
        previousVotes JSON NOT NULL,
        newVotes JSON NOT NULL,
        changedAt DATETIME NOT NULL,
        changeReason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(pollId) REFERENCES polls(id)
      );

      CREATE INDEX IF NOT EXISTS idx_votes_poll ON votes(pollId);
      CREATE INDEX IF NOT EXISTS idx_votes_user ON votes(userId);
      CREATE INDEX IF NOT EXISTS idx_votes_unique ON votes(pollId, userId);
      CREATE INDEX IF NOT EXISTS idx_polls_group ON polls(groupJid);
      CREATE INDEX IF NOT EXISTS idx_polls_status ON polls(status);
    `);
    }
    /**
     * SAVE POLL
     */
    async savePoll(poll) {
        const stmt = this.db.prepare(`
      INSERT INTO polls (id, question, pollType, choices, minSelections, maxSelections, createdAt, expiresAt, createdBy, groupJid, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        try {
            stmt.run(poll.id, poll.question, poll.type, JSON.stringify(poll.choices), poll.minSelections || null, poll.maxSelections || null, poll.createdAt.toISOString(), poll.expiresAt?.toISOString() || null, poll.createdBy, poll.groupJid || null, poll.status);
        }
        catch (error) {
            throw new Error(`Failed to save poll: ${error}`);
        }
    }
    /**
     * GET POLL
     */
    async getPoll(pollId) {
        const stmt = this.db.prepare('SELECT * FROM polls WHERE id = ?');
        const row = stmt.get(pollId);
        if (!row)
            return null;
        if (row.pollType === 'single') {
            return {
                id: row.id,
                type: 'single',
                question: row.question,
                choices: JSON.parse(row.choices),
                createdAt: new Date(row.createdAt),
                expiresAt: row.expiresAt ? new Date(row.expiresAt) : undefined,
                createdBy: row.createdBy,
                groupJid: row.groupJid,
                status: row.status,
            };
        }
        else {
            return {
                id: row.id,
                type: 'multiple',
                question: row.question,
                choices: JSON.parse(row.choices),
                minSelections: row.minSelections,
                maxSelections: row.maxSelections,
                createdAt: new Date(row.createdAt),
                expiresAt: row.expiresAt ? new Date(row.expiresAt) : undefined,
                createdBy: row.createdBy,
                groupJid: row.groupJid,
                status: row.status,
            };
        }
    }
    /**
     * SAVE VOTE
     */
    async saveVote(vote) {
        const id = `vote_${vote.pollId}_${vote.userId}_${Date.now()}`;
        const stmt = this.db.prepare(`
      INSERT INTO votes (id, pollId, userId, userPhone, selectedChoices, pollType, votedAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
        try {
            stmt.run(id, vote.pollId, vote.userId, vote.userPhone, JSON.stringify(vote.selectedChoices), vote.pollType, vote.votedAt.toISOString(), vote.updatedAt?.toISOString() || null);
        }
        catch (error) {
            throw new Error(`Failed to save vote: ${error}`);
        }
    }
    /**
     * GET USER VOTE
     */
    async getUserVote(pollId, userId) {
        const stmt = this.db.prepare('SELECT * FROM votes WHERE pollId = ? AND userId = ? ORDER BY votedAt DESC LIMIT 1');
        const row = stmt.get(pollId, userId);
        if (!row)
            return null;
        return {
            pollId: row.pollId,
            userId: row.userId,
            userPhone: row.userPhone,
            selectedChoices: JSON.parse(row.selectedChoices),
            pollType: row.pollType,
            votedAt: new Date(row.votedAt),
            updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
        };
    }
    /**
     * UPDATE VOTE
     */
    async updateVote(vote) {
        const stmt = this.db.prepare(`
      UPDATE votes 
      SET selectedChoices = ?, updatedAt = ?
      WHERE pollId = ? AND userId = ?
    `);
        try {
            stmt.run(JSON.stringify(vote.selectedChoices), vote.updatedAt?.toISOString(), vote.pollId, vote.userId);
        }
        catch (error) {
            throw new Error(`Failed to update vote: ${error}`);
        }
    }
    /**
     * GET POLL VOTES
     */
    async getPollVotes(pollId) {
        const stmt = this.db.prepare('SELECT * FROM votes WHERE pollId = ? ORDER BY votedAt ASC');
        const rows = stmt.all(pollId);
        return rows.map((row) => ({
            pollId: row.pollId,
            userId: row.userId,
            userPhone: row.userPhone,
            selectedChoices: JSON.parse(row.selectedChoices),
            pollType: row.pollType,
            votedAt: new Date(row.votedAt),
            updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
        }));
    }
    /**
     * SAVE VOTE CHANGE HISTORY
     */
    async saveVoteChangeHistory(history) {
        const id = `history_${history.pollId}_${history.userId}_${Date.now()}`;
        const stmt = this.db.prepare(`
      INSERT INTO vote_change_history (id, pollId, userId, previousVotes, newVotes, changedAt, changeReason)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        try {
            stmt.run(id, history.pollId, history.userId, JSON.stringify(history.previousVotes), JSON.stringify(history.newVotes), history.changedAt.toISOString(), history.changeReason || null);
        }
        catch (error) {
            throw new Error(`Failed to save vote change history: ${error}`);
        }
    }
    /**
     * UPDATE POLL STATUS
     */
    async updatePollStatus(pollId, status) {
        const stmt = this.db.prepare('UPDATE polls SET status = ? WHERE id = ?');
        try {
            stmt.run(status, pollId);
        }
        catch (error) {
            throw new Error(`Failed to update poll status: ${error}`);
        }
    }
    /**
     * LIST POLLS
     */
    async listPolls(groupJid) {
        let stmt;
        let rows;
        if (groupJid) {
            stmt = this.db.prepare('SELECT * FROM polls WHERE groupJid = ? AND status = ? ORDER BY createdAt DESC');
            rows = stmt.all(groupJid, 'active');
        }
        else {
            stmt = this.db.prepare('SELECT * FROM polls WHERE status = ? ORDER BY createdAt DESC');
            rows = stmt.all('active');
        }
        return rows.map((row) => row.pollType === 'single'
            ? {
                id: row.id,
                type: 'single',
                question: row.question,
                choices: JSON.parse(row.choices),
                createdAt: new Date(row.createdAt),
                expiresAt: row.expiresAt ? new Date(row.expiresAt) : undefined,
                createdBy: row.createdBy,
                groupJid: row.groupJid,
                status: row.status,
            }
            : {
                id: row.id,
                type: 'multiple',
                question: row.question,
                choices: JSON.parse(row.choices),
                minSelections: row.minSelections,
                maxSelections: row.maxSelections,
                createdAt: new Date(row.createdAt),
                expiresAt: row.expiresAt ? new Date(row.expiresAt) : undefined,
                createdBy: row.createdBy,
                groupJid: row.groupJid,
                status: row.status,
            });
    }
    /**
     * DELETE EXPIRED POLLS (Cleanup)
     */
    async deleteExpiredPolls() {
        const stmt = this.db.prepare('DELETE FROM polls WHERE expiresAt < datetime("now")');
        const result = stmt.run();
        return result.changes || 0;
    }
    /**
     * CLOSE DATABASE
     */
    close() {
        this.db.close();
    }
}
exports.PollDatabase = PollDatabase;
//# sourceMappingURL=pollDatabase.js.map