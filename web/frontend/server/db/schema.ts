import { pgTable, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// ─── Users ────────────────────────────────────────────────────
export const users = pgTable('users', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    passwordHash: text('password_hash').notNull(),
    createdAt: text('created_at').notNull(),
    xp: integer('xp').notNull().default(0),
    level: integer('level').notNull().default(1),
    lastLoginDate: text('last_login_date'),
    loginStreak: integer('login_streak').notNull().default(0),
});

// ─── Habits ───────────────────────────────────────────────────
export const habits = pgTable('habits', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    category: text('category').notNull().default('Custom'),
    startHour: integer('start_hour').notNull().default(6),
    startMinute: integer('start_minute').notNull().default(0),
    endHour: integer('end_hour').notNull().default(7),
    endMinute: integer('end_minute').notNull().default(0),
    daysOfWeek: text('days_of_week').notNull().default('1,2,3,4,5,6,7'),
    frequency: text('frequency').notNull().default('Daily'),
    reminderEnabled: boolean('reminder_enabled').notNull().default(true),
    createdAt: text('created_at').notNull(),
    currentStreak: integer('current_streak').notNull().default(0),
    longestStreak: integer('longest_streak').notNull().default(0),
    colorValue: integer('color_value').notNull().default(0xFFC8E600),
    userId: text('user_id').notNull().references(() => users.id),
});

// ─── Habit Entries ────────────────────────────────────────────
export const habitEntries = pgTable('habit_entries', {
    id: text('id').primaryKey(),
    habitId: text('habit_id').notNull().references(() => habits.id),
    date: text('date').notNull(),
    status: text('status').notNull().default('pending'),
    startedAt: text('started_at'),
    completedAt: text('completed_at'),
    durationSeconds: integer('duration_seconds'),
});

// ─── Posts ─────────────────────────────────────────────────────
export const posts = pgTable('posts', {
    id: text('id').primaryKey(),
    authorId: text('author_id').notNull().references(() => users.id),
    title: text('title').notNull(),
    body: text('body').notNull(),
    habitName: text('habit_name'),
    communityId: text('community_id'), // optional — null = global post
    imageUrl: text('image_url'), // optional media attachment
    upvotes: integer('upvotes').notNull().default(0),
    downvotes: integer('downvotes').notNull().default(0),
    commentCount: integer('comment_count').notNull().default(0),
    createdAt: text('created_at').notNull(),
});

// ─── Post Votes ───────────────────────────────────────────────
export const postVotes = pgTable('post_votes', {
    id: text('id').primaryKey(),
    postId: text('post_id').notNull().references(() => posts.id),
    userId: text('user_id').notNull().references(() => users.id),
    direction: integer('direction').notNull(), // +1 or -1
});

// ─── Comments ─────────────────────────────────────────────────
export const comments = pgTable('comments', {
    id: text('id').primaryKey(),
    postId: text('post_id').notNull().references(() => posts.id),
    authorId: text('author_id').notNull().references(() => users.id),
    body: text('body').notNull(),
    parentCommentId: text('parent_comment_id'),
    upvotes: integer('upvotes').notNull().default(0),
    createdAt: text('created_at').notNull(),
});

// ─── Challenges ───────────────────────────────────────────────
export const challenges = pgTable('challenges', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    creatorId: text('creator_id').notNull().references(() => users.id),
    startDate: text('start_date').notNull(),
    endDate: text('end_date').notNull(),
    habitCategory: text('habit_category').notNull().default('Fitness'),
    maxParticipants: integer('max_participants').notNull().default(50),
});

// ─── Challenge Participants ───────────────────────────────────
export const challengeParticipants = pgTable('challenge_participants', {
    id: text('id').primaryKey(),
    challengeId: text('challenge_id').notNull().references(() => challenges.id),
    userId: text('user_id').notNull().references(() => users.id),
    score: integer('score').notNull().default(0),
});

// ─── Chat Messages ────────────────────────────────────────────
export const chatMessages = pgTable('chat_messages', {
    id: text('id').primaryKey(),
    challengeId: text('challenge_id').notNull().references(() => challenges.id),
    senderId: text('sender_id').notNull().references(() => users.id),
    message: text('message').notNull(),
    sentAt: text('sent_at').notNull(),
});

// ─── Notifications ────────────────────────────────────────────
export const notifications = pgTable('notifications', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    type: text('type').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    isRead: boolean('is_read').notNull().default(false),
    createdAt: text('created_at').notNull(),
});

// ─── Badges (user-earned) ─────────────────────────────────────
export const userBadges = pgTable('user_badges', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    badgeName: text('badge_name').notNull(),
    earnedAt: text('earned_at').notNull(),
});

// ─── Direct Messages ──────────────────────────────────────────
export const directMessages = pgTable('direct_messages', {
    id: text('id').primaryKey(),
    senderId: text('sender_id').notNull().references(() => users.id),
    recipientId: text('recipient_id').notNull().references(() => users.id),
    message: text('message').notNull(),
    sentAt: text('sent_at').notNull(),
    isRead: boolean('is_read').notNull().default(false),
});

// ─── Friendships ──────────────────────────────────────────────
export const friendships = pgTable('friendships', {
    id: text('id').primaryKey(),
    requesterId: text('requester_id').notNull().references(() => users.id),
    addresseeId: text('addressee_id').notNull().references(() => users.id),
    status: text('status').notNull().default('pending'), // pending | accepted | rejected
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at'),
});

// ─── Communities ──────────────────────────────────────────────
export const communities = pgTable('communities', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description').notNull(),
    icon: text('icon'), // emoji or url
    bannerColor: text('banner_color').default('#7c5cfc'),
    bannerImage: text('banner_image'), // optional uploaded banner image
    category: text('category').notNull().default('General'),
    creatorId: text('creator_id').notNull().references(() => users.id),
    memberCount: integer('member_count').notNull().default(1),
    inviteCode: text('invite_code').notNull().unique(), // shareable invite code
    createdAt: text('created_at').notNull(),
});

// ─── Community Members ────────────────────────────────────────
export const communityMembers = pgTable('community_members', {
    id: text('id').primaryKey(),
    communityId: text('community_id').notNull().references(() => communities.id),
    userId: text('user_id').notNull().references(() => users.id),
    role: text('role').notNull().default('member'), // member | moderator | admin
    joinedAt: text('joined_at').notNull(),
});
