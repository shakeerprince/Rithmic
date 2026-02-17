// ─── Shared Types ─────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  daysOfWeek: number[];
  frequency: string;
  reminderEnabled: boolean;
  createdAt: string;
  currentStreak: number;
  longestStreak: number;
  colorValue: number;
  userId: string;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  habitName?: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: string;
  userVote?: number; // -1, 0, 1
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  body: string;
  parentCommentId?: string;
  upvotes: number;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  startDate: string;
  endDate: string;
  participantIds: string[];
  habitCategory: string;
  maxParticipants: number;
  isActive: boolean;
  daysRemaining: number;
  participantCount: number;
  leaderboard: { userId: string; name: string; score: number }[];
}

export interface ChatMessage {
  id: string;
  challengeId: string;
  senderId: string;
  senderName: string;
  message: string;
  sentAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'upvote' | 'post_reply' | 'challenge_invite' | 'streak_milestone' | 'chat_message' | 'reminder';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  requiredStreak: number;
  isEarned: boolean;
  earnedAt?: string;
}

export interface DashboardStats {
  momentumScore: number;
  completionPercent: number;
  totalWins: number;
  totalTarget: number;
  currentStreak: number;
  weeklyStreak: string[];
  chartData: number[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
