import { db, schema } from '../db';
import { randomUUID } from 'crypto';

/**
 * Auto-create notifications when events occur in the app.
 * This replaces hardcoded notifications with real, event-driven ones.
 */
export async function createNotification(
    userId: string,
    type: string,
    title: string,
    body: string,
) {
    await db.insert(schema.notifications).values({
        id: randomUUID(),
        userId,
        type,
        title,
        body,
        isRead: false,
        createdAt: new Date().toISOString(),
    });
}

// ─── Specific notification helpers ────────────────────────

export async function notifyUpvote(postOwnerId: string, voterName: string, postTitle: string) {
    await createNotification(
        postOwnerId,
        'upvote',
        'Post upvoted!',
        `${voterName} upvoted your post "${postTitle.slice(0, 40)}"`
    );
}

export async function notifyComment(postOwnerId: string, commenterName: string, postTitle: string) {
    await createNotification(
        postOwnerId,
        'post_reply',
        'New comment',
        `${commenterName} commented on your post "${postTitle.slice(0, 40)}"`
    );
}

export async function notifyChallengeJoin(challengeCreatorId: string, joinerName: string, challengeTitle: string) {
    await createNotification(
        challengeCreatorId,
        'challenge_invite',
        'New participant!',
        `${joinerName} joined your challenge "${challengeTitle}"`
    );
}

export async function notifyChatMessage(recipientIds: string[], senderName: string, challengeTitle: string, senderId: string) {
    for (const uid of recipientIds) {
        if (uid === senderId) continue; // don't notify yourself
        await createNotification(
            uid,
            'chat_message',
            'New message',
            `${senderName} sent a message in "${challengeTitle}"`
        );
    }
}

export async function notifyStreakMilestone(userId: string, streakDays: number, habitName: string) {
    await createNotification(
        userId,
        'streak_milestone',
        `🔥 ${streakDays}-Day Streak!`,
        `You're on fire! Keep your ${habitName} streak going`
    );
}

export async function notifyBadgeEarned(userId: string, badgeName: string) {
    await createNotification(
        userId,
        'streak_milestone',
        '🏅 Badge Earned!',
        `You've earned the "${badgeName}" badge! Keep it up!`
    );
}

export async function notifyDM(recipientId: string, senderName: string) {
    await createNotification(
        recipientId,
        'chat_message',
        'New message',
        `${senderName} sent you a direct message`
    );
}
