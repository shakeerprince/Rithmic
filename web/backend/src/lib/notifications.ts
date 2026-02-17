import { db, schema } from '../db';
import { randomUUID } from 'crypto';

/**
 * Auto-create notifications when events occur in the app.
 * This replaces hardcoded notifications with real, event-driven ones.
 */
export function createNotification(
    userId: string,
    type: string,
    title: string,
    body: string,
) {
    db.insert(schema.notifications).values({
        id: randomUUID(),
        userId,
        type,
        title,
        body,
        isRead: false,
        createdAt: new Date().toISOString(),
    }).run();
}

// ─── Specific notification helpers ────────────────────────

export function notifyUpvote(postOwnerId: string, voterName: string, postTitle: string) {
    createNotification(
        postOwnerId,
        'upvote',
        'Post upvoted!',
        `${voterName} upvoted your post "${postTitle.slice(0, 40)}"`
    );
}

export function notifyComment(postOwnerId: string, commenterName: string, postTitle: string) {
    createNotification(
        postOwnerId,
        'post_reply',
        'New comment',
        `${commenterName} commented on your post "${postTitle.slice(0, 40)}"`
    );
}

export function notifyChallengeJoin(challengeCreatorId: string, joinerName: string, challengeTitle: string) {
    createNotification(
        challengeCreatorId,
        'challenge_invite',
        'New participant!',
        `${joinerName} joined your challenge "${challengeTitle}"`
    );
}

export function notifyChatMessage(recipientIds: string[], senderName: string, challengeTitle: string, senderId: string) {
    for (const uid of recipientIds) {
        if (uid === senderId) continue; // don't notify yourself
        createNotification(
            uid,
            'chat_message',
            'New message',
            `${senderName} sent a message in "${challengeTitle}"`
        );
    }
}

export function notifyStreakMilestone(userId: string, streakDays: number, habitName: string) {
    createNotification(
        userId,
        'streak_milestone',
        `🔥 ${streakDays}-Day Streak!`,
        `You're on fire! Keep your ${habitName} streak going`
    );
}

export function notifyBadgeEarned(userId: string, badgeName: string) {
    createNotification(
        userId,
        'streak_milestone',
        '🏅 Badge Earned!',
        `You've earned the "${badgeName}" badge! Keep it up!`
    );
}

export function notifyDM(recipientId: string, senderName: string) {
    createNotification(
        recipientId,
        'chat_message',
        'New message',
        `${senderName} sent you a direct message`
    );
}
