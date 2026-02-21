import { db } from './db';
import {
  users, habits, habitEntries, posts, postVotes, comments, challenges,
  challengeParticipants, chatMessages, notifications, userBadges,
  directMessages, friendships, communities, communityMembers
} from './db/schema';

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysFromNow = (d: number) => new Date(Date.now() + d * 86400000).toISOString();
const today = new Date().toISOString().split('T')[0];

console.log('🌱 Seeding HabitCircle with Indian engagement data...');

async function main() {
  try {
    // Clear existing data
    console.log('🧹 Clearing old data...');
    const tables = [
      communityMembers, communities, friendships, directMessages, userBadges,
      notifications, chatMessages, challengeParticipants, challenges, comments,
      postVotes, posts, habitEntries, habits, users
    ];
    for (const table of tables) {
      await db.delete(table);
    }

    // ──────────────────── USERS (20) ────────────────────
    console.log('👤 Seeding 20 Users...');
    await db.insert(users).values([
      { id: 'u1', name: 'Shaker', email: 'shaker@habitcircle.app', bio: 'Building better habits, one day at a time 🚀', passwordHash: 'hashed_password_123', createdAt: daysAgo(90), xp: 1350, level: 8, lastLoginDate: today, loginStreak: 24 },
      { id: 'u2', name: 'Arjun Sharma', email: 'arjun@example.com', bio: 'IIT Delhi grad | 5AM Club | Marathon Runner 🏃', passwordHash: 'hashed_pw', createdAt: daysAgo(75), xp: 2200, level: 12, lastLoginDate: today, loginStreak: 45 },
      { id: 'u3', name: 'Priya Patel', email: 'priya@example.com', bio: 'Yoga instructor & mindfulness coach 🧘‍♀️ Namaste', passwordHash: 'hashed_pw', createdAt: daysAgo(60), xp: 1800, level: 10, lastLoginDate: today, loginStreak: 32 },
      { id: 'u4', name: 'Rohit Verma', email: 'rohit@example.com', bio: 'UPSC aspirant | 12hr study streaks 📚', passwordHash: 'hashed_pw', createdAt: daysAgo(50), xp: 1600, level: 9, lastLoginDate: today, loginStreak: 28 },
      { id: 'u5', name: 'Sneha Reddy', email: 'sneha@example.com', bio: 'Tech lead by day, reader by night 📖 50 books/year', passwordHash: 'hashed_pw', createdAt: daysAgo(45), xp: 1400, level: 8, lastLoginDate: today, loginStreak: 21 },
      { id: 'u6', name: 'Vikram Singh', email: 'vikram@example.com', bio: 'Crossfit enthusiast | Early morning warrior 💪', passwordHash: 'hashed_pw', createdAt: daysAgo(40), xp: 2500, level: 13, lastLoginDate: today, loginStreak: 38 },
      { id: 'u7', name: 'Ananya Iyer', email: 'ananya@example.com', bio: 'Meditation practitioner | Inner peace seeker ☮️', passwordHash: 'hashed_pw', createdAt: daysAgo(55), xp: 1100, level: 7, lastLoginDate: today, loginStreak: 18 },
      { id: 'u8', name: 'Karthik Nair', email: 'karthik@example.com', bio: 'Software engineer | Habit hacker 🔧', passwordHash: 'hashed_pw', createdAt: daysAgo(35), xp: 950, level: 6, lastLoginDate: today, loginStreak: 14 },
      { id: 'u9', name: 'Divya Gupta', email: 'divya@example.com', bio: 'Nutritionist | Healthy living advocate 🥗', passwordHash: 'hashed_pw', createdAt: daysAgo(30), xp: 800, level: 5, lastLoginDate: today, loginStreak: 11 },
      { id: 'u10', name: 'Aditya Mishra', email: 'aditya@example.com', bio: 'Coder & gym rat | Building discipline 🏋️', passwordHash: 'hashed_pw', createdAt: daysAgo(28), xp: 700, level: 5, lastLoginDate: today, loginStreak: 9 },
      { id: 'u11', name: 'Meera Joshi', email: 'meera@example.com', bio: 'Artist & morning person 🎨 Painting daily', passwordHash: 'hashed_pw', createdAt: daysAgo(25), xp: 600, level: 4, lastLoginDate: today, loginStreak: 7 },
      { id: 'u12', name: 'Harsh Agarwal', email: 'harsh@example.com', bio: 'Startup founder | Productivity geek 🚀', passwordHash: 'hashed_pw', createdAt: daysAgo(22), xp: 520, level: 4, lastLoginDate: today, loginStreak: 6 },
      { id: 'u13', name: 'Kavya Menon', email: 'kavya@example.com', bio: 'Dance & fitness | Bharatanatyam 💃', passwordHash: 'hashed_pw', createdAt: daysAgo(20), xp: 480, level: 4, lastLoginDate: today, loginStreak: 8 },
      { id: 'u14', name: 'Ravi Kumar', email: 'ravi@example.com', bio: 'CA student | Consistency is key 📊', passwordHash: 'hashed_pw', createdAt: daysAgo(18), xp: 420, level: 3, lastLoginDate: today, loginStreak: 5 },
      { id: 'u15', name: 'Nisha Chauhan', email: 'nisha@example.com', bio: 'Running enthusiast | Completed 3 marathons 🏅', passwordHash: 'hashed_pw', createdAt: daysAgo(15), xp: 380, level: 3, lastLoginDate: today, loginStreak: 4 },
      { id: 'u16', name: 'Siddharth Rao', email: 'sid@example.com', bio: 'MBA grad | Cold showers & gratitude journal 🙏', passwordHash: 'hashed_pw', createdAt: daysAgo(12), xp: 320, level: 3, lastLoginDate: today, loginStreak: 6 },
      { id: 'u17', name: 'Pooja Deshmukh', email: 'pooja@example.com', bio: 'Doctor | Balancing work & wellness 🩺', passwordHash: 'hashed_pw', createdAt: daysAgo(10), xp: 280, level: 3, lastLoginDate: today, loginStreak: 3 },
      { id: 'u18', name: 'Aman Tiwari', email: 'aman@example.com', bio: 'Engineering student | DSA grinder 💻', passwordHash: 'hashed_pw', createdAt: daysAgo(8), xp: 200, level: 2, lastLoginDate: today, loginStreak: 4 },
      { id: 'u19', name: 'Ishita Saxena', email: 'ishita@example.com', bio: 'Content creator | Journaling every day ✍️', passwordHash: 'hashed_pw', createdAt: daysAgo(5), xp: 150, level: 2, lastLoginDate: today, loginStreak: 5 },
      { id: 'u20', name: 'Deepak Jain', email: 'deepak@example.com', bio: 'Trader | Discipline = Profits 📈', passwordHash: 'hashed_pw', createdAt: daysAgo(3), xp: 100, level: 1, lastLoginDate: today, loginStreak: 3 },
    ]);

    // ──────────────────── HABITS (18) ────────────────────
    console.log('📅 Seeding Habits...');
    await db.insert(habits).values([
      { id: 'h1', name: 'Morning Run', category: 'Fitness', startHour: 5, startMinute: 30, endHour: 6, endMinute: 30, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(60), currentStreak: 24, longestStreak: 24, colorValue: 0x4ADE80, userId: 'u1' },
      { id: 'h2', name: 'Read 30 Pages', category: 'Study', startHour: 21, startMinute: 0, endHour: 22, endMinute: 0, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(45), currentStreak: 15, longestStreak: 20, colorValue: 0x6CB4EE, userId: 'u1' },
      { id: 'h3', name: 'Meditate 15min', category: 'Mindfulness', startHour: 6, startMinute: 0, endHour: 6, endMinute: 15, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(50), currentStreak: 8, longestStreak: 30, colorValue: 0xCB6CE6, userId: 'u1' },
      { id: 'h4', name: 'Drink 3L Water', category: 'Health', startHour: 7, startMinute: 0, endHour: 22, endMinute: 0, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(30), currentStreak: 12, longestStreak: 12, colorValue: 0xFFD93D, userId: 'u1' },
      { id: 'h5', name: '10K Steps', category: 'Fitness', startHour: 6, startMinute: 0, endHour: 20, endMinute: 0, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(70), currentStreak: 45, longestStreak: 45, colorValue: 0xFF4D6A, userId: 'u2' },
      { id: 'h6', name: 'Surya Namaskar', category: 'Fitness', startHour: 5, startMinute: 0, endHour: 5, endMinute: 30, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(55), currentStreak: 32, longestStreak: 32, colorValue: 0xFF9F43, userId: 'u3' },
      { id: 'h7', name: 'Pranayama', category: 'Mindfulness', startHour: 5, startMinute: 30, endHour: 6, endMinute: 0, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(55), currentStreak: 32, longestStreak: 32, colorValue: 0x9C27B0, userId: 'u3' },
      { id: 'h8', name: 'UPSC Study 6hr', category: 'Study', startHour: 8, startMinute: 0, endHour: 14, endMinute: 0, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(50), currentStreak: 28, longestStreak: 28, colorValue: 0x6CB4EE, userId: 'u4' },
      { id: 'h9', name: 'No Phone Till 8AM', category: 'Health', startHour: 5, startMinute: 0, endHour: 8, endMinute: 0, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(30), currentStreak: 21, longestStreak: 21, colorValue: 0xFFD93D, userId: 'u5' },
      { id: 'h10', name: 'Crossfit WOD', category: 'Fitness', startHour: 6, startMinute: 0, endHour: 7, endMinute: 0, daysOfWeek: '1,2,3,4,5', frequency: 'Custom', reminderEnabled: true, createdAt: daysAgo(40), currentStreak: 38, longestStreak: 38, colorValue: 0xFF4D6A, userId: 'u6' },
      { id: 'h11', name: 'Vipassana 20min', category: 'Mindfulness', startHour: 5, startMinute: 0, endHour: 5, endMinute: 20, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(50), currentStreak: 18, longestStreak: 40, colorValue: 0xCB6CE6, userId: 'u7' },
      { id: 'h12', name: 'LeetCode Daily', category: 'Study', startHour: 22, startMinute: 0, endHour: 23, endMinute: 0, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(35), currentStreak: 14, longestStreak: 14, colorValue: 0x4ADE80, userId: 'u8' },
      { id: 'h13', name: 'Meal Prep', category: 'Health', startHour: 10, startMinute: 0, endHour: 11, endMinute: 0, daysOfWeek: '1,4,7', frequency: 'Custom', reminderEnabled: true, createdAt: daysAgo(25), currentStreak: 8, longestStreak: 8, colorValue: 0xFF9F43, userId: 'u9' },
      { id: 'h14', name: 'Gym Session', category: 'Fitness', startHour: 17, startMinute: 0, endHour: 18, endMinute: 30, daysOfWeek: '1,2,3,4,5,6', frequency: 'Custom', reminderEnabled: true, createdAt: daysAgo(28), currentStreak: 9, longestStreak: 15, colorValue: 0xFF4D6A, userId: 'u10' },
      { id: 'h15', name: 'Painting', category: 'Health', startHour: 7, startMinute: 0, endHour: 8, endMinute: 0, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(20), currentStreak: 7, longestStreak: 7, colorValue: 0xCB6CE6, userId: 'u11' },
      { id: 'h16', name: 'Cold Shower', category: 'Health', startHour: 6, startMinute: 0, endHour: 6, endMinute: 10, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(12), currentStreak: 6, longestStreak: 6, colorValue: 0x6CB4EE, userId: 'u16' },
      { id: 'h17', name: 'Journal Writing', category: 'Mindfulness', startHour: 22, startMinute: 0, endHour: 22, endMinute: 30, daysOfWeek: '1,2,3,4,5,6,7', frequency: 'Daily', reminderEnabled: true, createdAt: daysAgo(5), currentStreak: 5, longestStreak: 5, colorValue: 0xFF9F43, userId: 'u19' },
      { id: 'h18', name: 'DSA Practice', category: 'Study', startHour: 20, startMinute: 0, endHour: 22, endMinute: 0, daysOfWeek: '1,2,3,4,5,6', frequency: 'Custom', reminderEnabled: true, createdAt: daysAgo(8), currentStreak: 4, longestStreak: 4, colorValue: 0x4ADE80, userId: 'u18' },
    ]);

    // ──────────────────── HABIT ENTRIES ──────────────────
    console.log('✅ Seeding Habit Entries...');
    const entries: { id: string; habitId: string; date: string; status: string; startedAt: string; completedAt: string | null; durationSeconds: number | null }[] = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date(Date.now() - d * 86400000).toISOString().split('T')[0];
      const userHabits = ['h1', 'h2', 'h3', 'h4'];
      for (const hid of userHabits) {
        const completed = d === 0 ? Math.random() > 0.4 : Math.random() > 0.2;
        const started = new Date(Date.now() - d * 86400000 + 3600000).toISOString();
        const finished = new Date(Date.now() - d * 86400000 + 7200000).toISOString();
        entries.push({
          id: `e-${hid}-${d}`, habitId: hid, date,
          status: completed ? 'completed' : 'pending',
          startedAt: started,
          completedAt: completed ? finished : null,
          durationSeconds: completed ? 1800 : null
        });
      }
    }
    await db.insert(habitEntries).values(entries);

    // ──────────────────── COMMUNITIES (8) ──────────────────
    console.log('🏘️ Seeding Communities...');
    await db.insert(communities).values([
      { id: 'com1', name: 'Morning Risers India', description: 'Wake up at 5AM and conquer the day! Join 500+ early birds across India who start their mornings with purpose.', icon: '🌅', bannerColor: '#FF9F43', category: 'Health', creatorId: 'u2', memberCount: 14, inviteCode: 'RISE5AM', createdAt: daysAgo(60) },
      { id: 'com2', name: 'Desi Fitness Club', description: 'From Surya Namaskar to Crossfit — your one-stop fitness community. Share PRs, routines & motivation!', icon: '💪', bannerColor: '#4ADE80', category: 'Fitness', creatorId: 'u6', memberCount: 16, inviteCode: 'DESIFIT', createdAt: daysAgo(55) },
      { id: 'com3', name: 'UPSC Warriors', description: 'Dedicated to UPSC/IAS aspirants. Share notes, discuss current affairs & keep each other accountable.', icon: '📚', bannerColor: '#6CB4EE', category: 'Study', creatorId: 'u4', memberCount: 12, inviteCode: 'UPSC24', createdAt: daysAgo(50) },
      { id: 'com4', name: 'Meditation Circle', description: 'Inner peace starts here. Practice Vipassana, Pranayama & mindful living together.', icon: '🧘', bannerColor: '#9C27B0', category: 'Mindfulness', creatorId: 'u3', memberCount: 11, inviteCode: 'CALM22', createdAt: daysAgo(45) },
      { id: 'com5', name: 'Bookworms India', description: 'Read, review & recommend. Monthly book challenges and author discussions!', icon: '📖', bannerColor: '#CB6CE6', category: 'Study', creatorId: 'u5', memberCount: 10, inviteCode: 'READON', createdAt: daysAgo(40) },
      { id: 'com6', name: 'Code & Chill', description: 'DSA, LeetCode, system design — grind together! Daily coding challenges and peer reviews.', icon: '💻', bannerColor: '#00D4FF', category: 'Study', creatorId: 'u8', memberCount: 9, inviteCode: 'CODE99', createdAt: daysAgo(30) },
      { id: 'com7', name: 'Healthy Eating India', description: 'Desi nutrition tips, meal preps & clean eating. From dal-chawal to protein bowls!', icon: '🥗', bannerColor: '#4ADE80', category: 'Health', creatorId: 'u9', memberCount: 8, inviteCode: 'EAT4FIT', createdAt: daysAgo(25) },
      { id: 'com8', name: 'Runners of India', description: 'From couch to marathon! Training plans, race reviews & running buddy finder 🏃', icon: '🏃', bannerColor: '#FF4D6A', category: 'Fitness', creatorId: 'u15', memberCount: 7, inviteCode: 'RUN42K', createdAt: daysAgo(15) },
    ]);

    // ──────────────────── COMMUNITY MEMBERS ──────────────
    console.log('👥 Seeding Community Members...');
    const members = [
      // Morning Risers India (14 members)
      { communityId: 'com1', userId: 'u2', role: 'admin' },
      { communityId: 'com1', userId: 'u1', role: 'member' },
      { communityId: 'com1', userId: 'u3', role: 'member' },
      { communityId: 'com1', userId: 'u4', role: 'member' },
      { communityId: 'com1', userId: 'u5', role: 'member' },
      { communityId: 'com1', userId: 'u6', role: 'member' },
      { communityId: 'com1', userId: 'u7', role: 'member' },
      { communityId: 'com1', userId: 'u10', role: 'member' },
      { communityId: 'com1', userId: 'u12', role: 'member' },
      { communityId: 'com1', userId: 'u14', role: 'member' },
      { communityId: 'com1', userId: 'u16', role: 'member' },
      { communityId: 'com1', userId: 'u17', role: 'member' },
      { communityId: 'com1', userId: 'u19', role: 'member' },
      { communityId: 'com1', userId: 'u20', role: 'member' },
      // Desi Fitness Club (16 members)
      { communityId: 'com2', userId: 'u6', role: 'admin' },
      { communityId: 'com2', userId: 'u1', role: 'member' },
      { communityId: 'com2', userId: 'u2', role: 'member' },
      { communityId: 'com2', userId: 'u3', role: 'member' },
      { communityId: 'com2', userId: 'u10', role: 'member' },
      { communityId: 'com2', userId: 'u13', role: 'member' },
      { communityId: 'com2', userId: 'u15', role: 'member' },
      { communityId: 'com2', userId: 'u17', role: 'member' },
      // UPSC Warriors
      { communityId: 'com3', userId: 'u4', role: 'admin' },
      { communityId: 'com3', userId: 'u1', role: 'member' },
      { communityId: 'com3', userId: 'u5', role: 'member' },
      { communityId: 'com3', userId: 'u14', role: 'member' },
      { communityId: 'com3', userId: 'u18', role: 'member' },
      // Meditation Circle
      { communityId: 'com4', userId: 'u3', role: 'admin' },
      { communityId: 'com4', userId: 'u1', role: 'member' },
      { communityId: 'com4', userId: 'u7', role: 'member' },
      { communityId: 'com4', userId: 'u16', role: 'member' },
      { communityId: 'com4', userId: 'u19', role: 'member' },
      // Bookworms India
      { communityId: 'com5', userId: 'u5', role: 'admin' },
      { communityId: 'com5', userId: 'u1', role: 'member' },
      { communityId: 'com5', userId: 'u4', role: 'member' },
      { communityId: 'com5', userId: 'u11', role: 'member' },
      { communityId: 'com5', userId: 'u19', role: 'member' },
      // Code & Chill
      { communityId: 'com6', userId: 'u8', role: 'admin' },
      { communityId: 'com6', userId: 'u1', role: 'member' },
      { communityId: 'com6', userId: 'u10', role: 'member' },
      { communityId: 'com6', userId: 'u12', role: 'member' },
      { communityId: 'com6', userId: 'u18', role: 'member' },
      // Healthy Eating India
      { communityId: 'com7', userId: 'u9', role: 'admin' },
      { communityId: 'com7', userId: 'u1', role: 'member' },
      { communityId: 'com7', userId: 'u3', role: 'member' },
      { communityId: 'com7', userId: 'u13', role: 'member' },
      // Runners of India
      { communityId: 'com8', userId: 'u15', role: 'admin' },
      { communityId: 'com8', userId: 'u1', role: 'member' },
      { communityId: 'com8', userId: 'u2', role: 'member' },
      { communityId: 'com8', userId: 'u6', role: 'member' },
    ].map((m, i) => ({ ...m, id: `cm${i + 1}`, joinedAt: daysAgo(Math.floor(Math.random() * 30) + 1) }));
    await db.insert(communityMembers).values(members);

    // ──────────────────── POSTS (18) ──────────────────
    console.log('📝 Seeding Posts...');
    await db.insert(posts).values([
      { id: 'p1', authorId: 'u2', title: '45-day streak! The 5AM Club changed my life', body: 'Started waking up at 5AM religiously. My productivity has 3x-ed. The first week was hell but now I cant imagine sleeping past 5:30. Key tip: keep your alarm across the room and have your workout clothes ready the night before.', habitName: 'Morning Routine', communityId: 'com1', upvotes: 187, downvotes: 3, commentCount: 4, createdAt: daysAgo(1) },
      { id: 'p2', authorId: 'u3', title: 'How Surya Namaskar transformed my mornings', body: 'Been doing 12 rounds of Surya Namaskar every morning for 32 days straight. My flexibility has improved dramatically and I feel energized throughout the day. Started with 4 rounds and slowly built up. Anyone else here doing it?', habitName: 'Surya Namaskar', communityId: 'com2', upvotes: 134, downvotes: 2, commentCount: 3, createdAt: daysAgo(2) },
      { id: 'p3', authorId: 'u4', title: 'UPSC Prelims Strategy: 6hr daily study plan', body: 'Sharing my study schedule that helped me crack prelims. 6AM-8AM: Current Affairs, 8AM-12PM: GS Papers, 2PM-4PM: Optional Subject, 8PM-10PM: Revision. The key is consistency, not intensity.', communityId: 'com3', upvotes: 98, downvotes: 1, commentCount: 3, createdAt: daysAgo(3) },
      { id: 'p4', authorId: 'u1', title: 'My running journey: 0 to 10K in 3 months', body: 'Three months ago I could barely run 1km without stopping. Today I completed my first 10K! The secret? Start slow and never skip a day. Even on bad days, I walked. Consistency beats intensity every single time.', habitName: 'Morning Run', communityId: 'com8', upvotes: 245, downvotes: 1, commentCount: 4, createdAt: daysAgo(1) },
      { id: 'p5', authorId: 'u5', title: 'Book Review: Atomic Habits by James Clear', body: 'Just finished Atomic Habits for the 3rd time. Every re-read I discover something new. My favorite takeaway: "You do not rise to the level of your goals. You fall to the level of your systems." This book is literally why I am on this app!', communityId: 'com5', upvotes: 156, downvotes: 0, commentCount: 3, createdAt: daysAgo(4) },
      { id: 'p6', authorId: 'u6', title: 'Crossfit WOD results - new PR! 💪', body: 'Hit a new deadlift PR today: 180kg! Consistency in the gym for the past 38 days has been insane. My advice: track everything, eat enough protein (at least 1.5g per kg bodyweight), and sleep 7+ hours.', communityId: 'com2', upvotes: 89, downvotes: 2, commentCount: 2, createdAt: daysAgo(2) },
      { id: 'p7', authorId: 'u7', title: 'Vipassana retreat experience — 10 days of silence', body: 'Just completed my first 10-day Vipassana retreat. No talking, no phones, no eye contact. Just meditation for 10+ hours daily. It was the hardest and most transformative experience of my life. AMA!', communityId: 'com4', upvotes: 178, downvotes: 1, commentCount: 3, createdAt: daysAgo(5) },
      { id: 'p8', authorId: 'u8', title: 'LeetCode 100-day streak completed! 🎯', body: 'Finally hit my 100-day LeetCode streak. Started with Easy problems and now comfortably solving Mediums in 20 mins. The key is doing at least 1 problem daily, even on weekends. Landed 3 interview calls this month!', communityId: 'com6', upvotes: 112, downvotes: 0, commentCount: 2, createdAt: daysAgo(3) },
      { id: 'p9', authorId: 'u9', title: 'Easy high-protein Indian meal prep 🥗', body: 'My weekly meal prep: Monday: Paneer tikka + brown rice, Wednesday: Chicken curry + roti, Friday: Dal tadka + quinoa. Each meal is 40g+ protein and takes 30 mins to prep. DM me for detailed recipes!', communityId: 'com7', upvotes: 67, downvotes: 1, commentCount: 2, createdAt: daysAgo(6) },
      { id: 'p10', authorId: 'u10', title: 'Gym + Coding = Best combo', body: 'Hot take: working out before coding makes you write better code. My bug count dropped by 40% since I started hitting the gym in the morning. The endorphins really help with problem-solving!', upvotes: 73, downvotes: 5, commentCount: 2, createdAt: daysAgo(4) },
      { id: 'p11', authorId: 'u11', title: 'Daily painting challenge - Day 7', body: 'One week of painting every single day! Started with simple landscapes and now trying portraits. The improvement is visible even in just 7 days. Sharing my Day 1 vs Day 7 comparison.', upvotes: 45, downvotes: 0, commentCount: 1, createdAt: daysAgo(2) },
      { id: 'p12', authorId: 'u12', title: 'Startup founders: how do you maintain habits?', body: 'Running a startup is chaotic but habits keep me grounded. My non-negotiables: 5AM wake up, 30 min exercise, 10 min meditation, and absolutely no social media before 12PM. What are yours?', communityId: 'com1', upvotes: 88, downvotes: 2, commentCount: 2, createdAt: daysAgo(7) },
      { id: 'p13', authorId: 'u13', title: 'Bharatanatyam as a fitness habit 💃', body: 'People underestimate how intense classical dance is. 1 hour of Bharatanatyam burns 400-500 calories. Plus it improves posture, flexibility, and mental focus. Best workout that doesnt feel like one!', communityId: 'com2', upvotes: 56, downvotes: 0, commentCount: 1, createdAt: daysAgo(5) },
      { id: 'p14', authorId: 'u16', title: 'Cold shower challenge - Day 6 ❄️', body: 'Started with 30 seconds of cold water at the end of my shower. Now doing full 3-minute cold showers. The mental clarity afterward is unreal. Anyone else doing this?', upvotes: 34, downvotes: 3, commentCount: 1, createdAt: daysAgo(3) },
      { id: 'p15', authorId: 'u14', title: 'CA study routine that actually works', body: 'Cracked CA Inter in first attempt with this routine: 5 hours focused study (no phone), 1 hour revision, mock tests every Sunday. The Pomodoro technique was a game changer for me.', communityId: 'com3', upvotes: 62, downvotes: 0, commentCount: 2, createdAt: daysAgo(8) },
      { id: 'p16', authorId: 'u15', title: 'Mumbai Marathon 2026 — who is joining?', body: 'Registered for Mumbai Marathon in January! Looking for training buddies in Mumbai. Currently doing 5K daily, planning to ramp up to 15K by December. Drop your training plan below!', communityId: 'com8', upvotes: 78, downvotes: 1, commentCount: 2, createdAt: daysAgo(2) },
      { id: 'p17', authorId: 'u19', title: 'Journaling prompts that changed my mindset', body: '5 journal prompts I use daily: 1) What am I grateful for? 2) What is my #1 priority today? 3) What scared me today? 4) What did I learn? 5) How can I be 1% better tomorrow?', communityId: 'com4', upvotes: 91, downvotes: 0, commentCount: 2, createdAt: daysAgo(1) },
      { id: 'p18', authorId: 'u18', title: 'From 0 to 200 LeetCode problems in 2 months', body: 'Started DSA prep for placements. Solved 200 problems in 60 days by following Striver SDE sheet. Key: understand patterns, dont just memorize solutions. Happy to share my topic-wise breakdown!', communityId: 'com6', upvotes: 104, downvotes: 1, commentCount: 2, createdAt: daysAgo(4) },
    ]);

    // ──────────────────── COMMENTS (22) ──────────────────
    console.log('💬 Seeding Comments...');
    await db.insert(comments).values([
      { id: 'c1', postId: 'p1', authorId: 'u1', body: 'This is exactly what I needed to read! Starting the 5AM challenge from tomorrow. Thanks Arjun bhai! 🙌', upvotes: 23, createdAt: daysAgo(1) },
      { id: 'c2', postId: 'p1', authorId: 'u3', body: 'Been doing the 5AM routine for 32 days now. Pro tip: no screens 1 hour before bed makes waking up so much easier!', upvotes: 18, createdAt: daysAgo(1) },
      { id: 'c3', postId: 'p1', authorId: 'u6', body: 'The 5AM Club by Robin Sharma is what got me started. 20-20-20 formula is gold!', upvotes: 12, createdAt: daysAgo(0) },
      { id: 'c4', postId: 'p1', authorId: 'u12', body: 'Arjun, what do you do in the first hour after waking up?', upvotes: 8, createdAt: daysAgo(0) },
      { id: 'c5', postId: 'p2', authorId: 'u1', body: 'Surya Namaskar is underrated! I do 5 rounds before my run. The flexibility gains are real.', upvotes: 15, createdAt: daysAgo(2) },
      { id: 'c6', postId: 'p2', authorId: 'u6', body: 'Started doing these as warm-up before Crossfit. Game changer for mobility!', upvotes: 11, createdAt: daysAgo(1) },
      { id: 'c7', postId: 'p2', authorId: 'u7', body: 'Combining this with Pranayama in the morning is the perfect combo! 🧘‍♀️', upvotes: 9, createdAt: daysAgo(1) },
      { id: 'c8', postId: 'p3', authorId: 'u14', body: 'This schedule is similar to what Toppers suggest! thanks for sharing Rohit 🙏', upvotes: 14, createdAt: daysAgo(2) },
      { id: 'c9', postId: 'p3', authorId: 'u18', body: 'Which resources do you use for Current Affairs? Newspaper or online?', upvotes: 7, createdAt: daysAgo(2) },
      { id: 'c10', postId: 'p3', authorId: 'u5', body: 'The key insight about consistency > intensity applies to everything in life!', upvotes: 10, createdAt: daysAgo(1) },
      { id: 'c11', postId: 'p4', authorId: 'u2', body: 'Incredible progress Shaker! The first kilometer is always the hardest. You smashed it! 🔥', upvotes: 28, createdAt: daysAgo(1) },
      { id: 'c12', postId: 'p4', authorId: 'u15', body: 'Welcome to the runners club! Next stop: half marathon? 😄', upvotes: 19, createdAt: daysAgo(0) },
      { id: 'c13', postId: 'p4', authorId: 'u6', body: 'This is why I love this app. Real progress, real people! Keep crushing it!', upvotes: 15, createdAt: daysAgo(0) },
      { id: 'c14', postId: 'p4', authorId: 'u3', body: 'So inspiring! Try adding yoga for recovery on rest days. Trust me it helps!', upvotes: 12, createdAt: daysAgo(0) },
      { id: 'c15', postId: 'p5', authorId: 'u1', body: 'This book literally changed my approach to habits. The 1% better every day concept is powerful.', upvotes: 16, createdAt: daysAgo(3) },
      { id: 'c16', postId: 'p5', authorId: 'u4', body: 'Reading it for UPSC prep motivation. The chapter on identity-based habits is brilliant!', upvotes: 11, createdAt: daysAgo(3) },
      { id: 'c17', postId: 'p5', authorId: 'u19', body: 'Writing a journal entry about this book tonight! Thanks for sharing Sneha 📝', upvotes: 8, createdAt: daysAgo(2) },
      { id: 'c18', postId: 'p7', authorId: 'u3', body: 'Vipassana changed my life too. Did my first retreat in Igatpuri. Life-altering experience!', upvotes: 20, createdAt: daysAgo(4) },
      { id: 'c19', postId: 'p7', authorId: 'u1', body: 'This is on my bucket list! How do you sign up?', upvotes: 13, createdAt: daysAgo(4) },
      { id: 'c20', postId: 'p7', authorId: 'u16', body: 'Started with 20-min daily Vipassana after reading about your experience. Day 3 and already feeling different.', upvotes: 9, createdAt: daysAgo(3) },
      { id: 'c21', postId: 'p8', authorId: 'u18', body: 'This is so motivating! Im on day 30 of my LeetCode streak. Your post keeps me going!', upvotes: 14, createdAt: daysAgo(2) },
      { id: 'c22', postId: 'p8', authorId: 'u10', body: 'Which topics did you focus on first? I keep getting stuck on DP problems 😅', upvotes: 10, createdAt: daysAgo(2) },
    ]);

    // ──────────────────── CHALLENGES (5) ──────────────────
    console.log('🏆 Seeding Challenges...');
    await db.insert(challenges).values([
      { id: 'ch1', title: '30-Day Running Challenge', description: 'Run at least 2km every day for 30 days. Track your distance and share progress! 🏃', creatorId: 'u2', startDate: daysAgo(10), endDate: daysFromNow(20), habitCategory: 'Fitness', maxParticipants: 50 },
      { id: 'ch2', title: 'Meditation Marathon', description: 'Meditate for at least 15 minutes every day for 30 days. Mind over matter! 🧘', creatorId: 'u3', startDate: daysAgo(5), endDate: daysFromNow(25), habitCategory: 'Mindfulness', maxParticipants: 40 },
      { id: 'ch3', title: 'Read 5 Books This Month', description: 'Challenge yourself to read 5 books in 30 days. Any genre counts! 📚', creatorId: 'u5', startDate: daysAgo(8), endDate: daysFromNow(22), habitCategory: 'Study', maxParticipants: 30 },
      { id: 'ch4', title: '100 Pushups Daily', description: 'Do 100 pushups every day. Can be spread across the day. Track and share! 💪', creatorId: 'u6', startDate: daysFromNow(2), endDate: daysFromNow(32), habitCategory: 'Fitness', maxParticipants: 50 },
      { id: 'ch5', title: 'No Social Media Week', description: 'Delete all social media apps for 7 days. Replace scroll time with productive habits! 📵', creatorId: 'u12', startDate: daysFromNow(5), endDate: daysFromNow(12), habitCategory: 'Health', maxParticipants: 100 },
    ]);

    // ──────────────────── CHALLENGE PARTICIPANTS ──────────
    console.log('👥 Seeding Challenge Participants...');
    await db.insert(challengeParticipants).values([
      { id: 'cp1', challengeId: 'ch1', userId: 'u1', score: 8 },
      { id: 'cp2', challengeId: 'ch1', userId: 'u2', score: 10 },
      { id: 'cp3', challengeId: 'ch1', userId: 'u6', score: 9 },
      { id: 'cp4', challengeId: 'ch1', userId: 'u10', score: 7 },
      { id: 'cp5', challengeId: 'ch1', userId: 'u15', score: 10 },
      { id: 'cp6', challengeId: 'ch1', userId: 'u13', score: 6 },
      { id: 'cp7', challengeId: 'ch2', userId: 'u1', score: 4 },
      { id: 'cp8', challengeId: 'ch2', userId: 'u3', score: 5 },
      { id: 'cp9', challengeId: 'ch2', userId: 'u7', score: 5 },
      { id: 'cp10', challengeId: 'ch2', userId: 'u16', score: 3 },
      { id: 'cp11', challengeId: 'ch2', userId: 'u19', score: 4 },
      { id: 'cp12', challengeId: 'ch3', userId: 'u1', score: 3 },
      { id: 'cp13', challengeId: 'ch3', userId: 'u4', score: 4 },
      { id: 'cp14', challengeId: 'ch3', userId: 'u5', score: 5 },
      { id: 'cp15', challengeId: 'ch3', userId: 'u11', score: 2 },
      { id: 'cp16', challengeId: 'ch3', userId: 'u19', score: 3 },
    ]);

    // ──────────────────── FRIENDSHIPS (15) ──────────────
    console.log('🤝 Seeding Friendships...');
    await db.insert(friendships).values([
      { id: 'f1', requesterId: 'u1', addresseeId: 'u2', status: 'accepted', createdAt: daysAgo(30), updatedAt: daysAgo(29) },
      { id: 'f2', requesterId: 'u1', addresseeId: 'u3', status: 'accepted', createdAt: daysAgo(28), updatedAt: daysAgo(27) },
      { id: 'f3', requesterId: 'u1', addresseeId: 'u4', status: 'accepted', createdAt: daysAgo(25), updatedAt: daysAgo(24) },
      { id: 'f4', requesterId: 'u1', addresseeId: 'u5', status: 'accepted', createdAt: daysAgo(20), updatedAt: daysAgo(19) },
      { id: 'f5', requesterId: 'u1', addresseeId: 'u6', status: 'accepted', createdAt: daysAgo(15), updatedAt: daysAgo(14) },
      { id: 'f6', requesterId: 'u2', addresseeId: 'u3', status: 'accepted', createdAt: daysAgo(40), updatedAt: daysAgo(39) },
      { id: 'f7', requesterId: 'u2', addresseeId: 'u6', status: 'accepted', createdAt: daysAgo(35), updatedAt: daysAgo(34) },
      { id: 'f8', requesterId: 'u3', addresseeId: 'u7', status: 'accepted', createdAt: daysAgo(30), updatedAt: daysAgo(29) },
      { id: 'f9', requesterId: 'u4', addresseeId: 'u5', status: 'accepted', createdAt: daysAgo(25), updatedAt: daysAgo(24) },
      { id: 'f10', requesterId: 'u6', addresseeId: 'u10', status: 'accepted', createdAt: daysAgo(20), updatedAt: daysAgo(19) },
      { id: 'f11', requesterId: 'u8', addresseeId: 'u18', status: 'accepted', createdAt: daysAgo(15), updatedAt: daysAgo(14) },
      { id: 'f12', requesterId: 'u9', addresseeId: 'u3', status: 'accepted', createdAt: daysAgo(12), updatedAt: daysAgo(11) },
      { id: 'f13', requesterId: 'u7', addresseeId: 'u1', status: 'pending', createdAt: daysAgo(2) },
      { id: 'f14', requesterId: 'u11', addresseeId: 'u1', status: 'pending', createdAt: daysAgo(1) },
      { id: 'f15', requesterId: 'u15', addresseeId: 'u2', status: 'accepted', createdAt: daysAgo(10), updatedAt: daysAgo(9) },
    ]);

    // ──────────────────── DIRECT MESSAGES (12) ──────────
    console.log('💬 Seeding DMs...');
    await db.insert(directMessages).values([
      { id: 'dm1', senderId: 'u2', recipientId: 'u1', message: 'Hey Shaker! Saw your 10K post, amazing progress! Want to join the 30-day running challenge?', sentAt: daysAgo(1), isRead: false },
      { id: 'dm2', senderId: 'u1', recipientId: 'u2', message: 'Thanks Arjun bhai! Already joined it 🏃 Lets do this!', sentAt: daysAgo(1), isRead: true },
      { id: 'dm3', senderId: 'u3', recipientId: 'u1', message: 'Namaste! Would you like to try a guided meditation session? I teach every Sunday at 6AM', sentAt: daysAgo(2), isRead: false },
      { id: 'dm4', senderId: 'u5', recipientId: 'u1', message: 'Have you read Atomic Habits? Its perfect for what you are building!', sentAt: daysAgo(3), isRead: true },
      { id: 'dm5', senderId: 'u1', recipientId: 'u5', message: 'Yes! Its literally the inspiration for HabitCircle 😄 Great recommendation!', sentAt: daysAgo(3), isRead: true },
      { id: 'dm6', senderId: 'u6', recipientId: 'u2', message: 'Arjun, your running stats are insane! What shoes are you using?', sentAt: daysAgo(2), isRead: true },
      { id: 'dm7', senderId: 'u2', recipientId: 'u6', message: 'Nike Pegasus 41. Best investment I have made for running. Highly recommend!', sentAt: daysAgo(2), isRead: true },
      { id: 'dm8', senderId: 'u4', recipientId: 'u5', message: 'Sneha, can you recommend good books for GS Paper 1?', sentAt: daysAgo(4), isRead: true },
      { id: 'dm9', senderId: 'u5', recipientId: 'u4', message: 'Sure! Start with Bipan Chandra for History and Majid Husain for Geography. DM me anytime!', sentAt: daysAgo(4), isRead: true },
      { id: 'dm10', senderId: 'u8', recipientId: 'u18', message: 'Aman, lets do a weekly mock interview practice for coding interviews!', sentAt: daysAgo(3), isRead: true },
      { id: 'dm11', senderId: 'u18', recipientId: 'u8', message: 'Karthik bhai thats a great idea! Weekends work for me. Google Meet?', sentAt: daysAgo(3), isRead: true },
      { id: 'dm12', senderId: 'u15', recipientId: 'u1', message: 'Hey! I saw you joined Runners of India. Want to be running buddies? Im training for Mumbai Marathon!', sentAt: daysAgo(1), isRead: false },
    ]);

    // ──────────────────── NOTIFICATIONS ──────────────────
    console.log('🔔 Seeding Notifications...');
    await db.insert(notifications).values([
      { id: 'n1', userId: 'u1', type: 'upvote', title: 'Post upvoted! 🎉', body: 'Arjun Sharma and 244 others upvoted your post "My running journey"', isRead: false, createdAt: daysAgo(0) },
      { id: 'n2', userId: 'u1', type: 'post_reply', title: 'New comment 💬', body: 'Arjun Sharma commented: "Incredible progress Shaker!"', isRead: false, createdAt: daysAgo(1) },
      { id: 'n3', userId: 'u1', type: 'challenge_invite', title: 'Challenge Invite 🏆', body: 'Priya Patel invited you to Meditation Marathon', isRead: false, createdAt: daysAgo(2) },
      { id: 'n4', userId: 'u1', type: 'streak_milestone', title: '🔥 24-Day Streak!', body: 'You are on fire! Keep your Morning Run streak going!', isRead: false, createdAt: daysAgo(0) },
      { id: 'n5', userId: 'u1', type: 'chat_message', title: 'New message 💬', body: 'Arjun Sharma sent you a direct message', isRead: false, createdAt: daysAgo(1) },
      { id: 'n6', userId: 'u1', type: 'post_reply', title: 'New comment 💬', body: 'Nisha Chauhan commented: "Welcome to the runners club!"', isRead: false, createdAt: daysAgo(0) },
      { id: 'n7', userId: 'u1', type: 'challenge_invite', title: 'New participant! 🎯', body: 'Vikram Singh joined your challenge "30-Day Running Challenge"', isRead: true, createdAt: daysAgo(3) },
      { id: 'n8', userId: 'u1', type: 'streak_milestone', title: '🏅 Badge Earned!', body: 'You earned the "14-Day Fighter" badge! Keep it up!', isRead: true, createdAt: daysAgo(10) },
      { id: 'n9', userId: 'u1', type: 'upvote', title: 'Post upvoted! 🎉', body: 'Priya Patel upvoted your post', isRead: true, createdAt: daysAgo(5) },
      { id: 'n10', userId: 'u1', type: 'chat_message', title: 'New message 💬', body: 'Nisha Chauhan sent you a direct message', isRead: false, createdAt: daysAgo(1) },
    ]);

    // ──────────────────── BADGES ──────────────────
    console.log('🏅 Seeding Badges...');
    await db.insert(userBadges).values([
      { id: 'b1', userId: 'u1', badgeName: '7-Day Warrior', earnedAt: daysAgo(17) },
      { id: 'b2', userId: 'u1', badgeName: '14-Day Fighter', earnedAt: daysAgo(10) },
      { id: 'b3', userId: 'u2', badgeName: '7-Day Warrior', earnedAt: daysAgo(68) },
      { id: 'b4', userId: 'u2', badgeName: '14-Day Fighter', earnedAt: daysAgo(61) },
      { id: 'b5', userId: 'u2', badgeName: '30-Day Legend', earnedAt: daysAgo(45) },
      { id: 'b6', userId: 'u3', badgeName: '7-Day Warrior', earnedAt: daysAgo(48) },
      { id: 'b7', userId: 'u3', badgeName: '14-Day Fighter', earnedAt: daysAgo(41) },
      { id: 'b8', userId: 'u3', badgeName: '30-Day Legend', earnedAt: daysAgo(25) },
      { id: 'b9', userId: 'u6', badgeName: '7-Day Warrior', earnedAt: daysAgo(33) },
      { id: 'b10', userId: 'u6', badgeName: '14-Day Fighter', earnedAt: daysAgo(26) },
      { id: 'b11', userId: 'u6', badgeName: '30-Day Legend', earnedAt: daysAgo(10) },
      { id: 'b12', userId: 'u4', badgeName: '7-Day Warrior', earnedAt: daysAgo(43) },
    ]);

    console.log('\n🏁 Seeding finished successfully!');
    console.log('📊 Summary: 20 users, 18 habits, 8 communities, 18 posts, 22 comments, 5 challenges, 15 friendships, 12 DMs, 10 notifications, 12 badges');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
