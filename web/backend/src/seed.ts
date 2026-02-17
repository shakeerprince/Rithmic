import { Database } from 'bun:sqlite';
import { resolve } from 'path';

const __dirname = import.meta.dir;
const dbPath = resolve(__dirname, '../data.db');
const sqlite = new Database(dbPath, { create: true });
sqlite.exec('PRAGMA journal_mode = WAL');
sqlite.exec('PRAGMA foreign_keys = ON');

const now = new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysFromNow = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

console.log('🌱 Seeding database...');

// Create tables
sqlite.exec(`
  DROP TABLE IF EXISTS community_members;
  DROP TABLE IF EXISTS communities;
  DROP TABLE IF EXISTS friendships;
  DROP TABLE IF EXISTS direct_messages;
  DROP TABLE IF EXISTS user_badges;
  DROP TABLE IF EXISTS notifications;
  DROP TABLE IF EXISTS chat_messages;
  DROP TABLE IF EXISTS challenge_participants;
  DROP TABLE IF EXISTS challenges;
  DROP TABLE IF EXISTS comments;
  DROP TABLE IF EXISTS post_votes;
  DROP TABLE IF EXISTS posts;
  DROP TABLE IF EXISTS habit_entries;
  DROP TABLE IF EXISTS habits;
  DROP TABLE IF EXISTS users;

  CREATE TABLE users (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
    avatar_url TEXT, bio TEXT, password_hash TEXT NOT NULL, created_at TEXT NOT NULL,
    xp INTEGER NOT NULL DEFAULT 0, level INTEGER NOT NULL DEFAULT 1,
    last_login_date TEXT, login_streak INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE habits (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'Custom',
    start_hour INTEGER NOT NULL DEFAULT 6, start_minute INTEGER NOT NULL DEFAULT 0,
    end_hour INTEGER NOT NULL DEFAULT 7, end_minute INTEGER NOT NULL DEFAULT 0,
    days_of_week TEXT NOT NULL DEFAULT '1,2,3,4,5,6,7', frequency TEXT NOT NULL DEFAULT 'Daily',
    reminder_enabled INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL,
    current_streak INTEGER NOT NULL DEFAULT 0, longest_streak INTEGER NOT NULL DEFAULT 0,
    color_value INTEGER NOT NULL DEFAULT 13165056, user_id TEXT NOT NULL REFERENCES users(id)
  );
  CREATE TABLE habit_entries (
    id TEXT PRIMARY KEY, habit_id TEXT NOT NULL REFERENCES habits(id),
    date TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
    started_at TEXT, completed_at TEXT, duration_seconds INTEGER
  );
  CREATE TABLE posts (
    id TEXT PRIMARY KEY, author_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL, body TEXT NOT NULL, habit_name TEXT,
    community_id TEXT, image_url TEXT,
    upvotes INTEGER NOT NULL DEFAULT 0, downvotes INTEGER NOT NULL DEFAULT 0,
    comment_count INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL
  );
  CREATE TABLE post_votes (
    id TEXT PRIMARY KEY, post_id TEXT NOT NULL REFERENCES posts(id),
    user_id TEXT NOT NULL REFERENCES users(id), direction INTEGER NOT NULL
  );
  CREATE TABLE comments (
    id TEXT PRIMARY KEY, post_id TEXT NOT NULL REFERENCES posts(id),
    author_id TEXT NOT NULL REFERENCES users(id), body TEXT NOT NULL,
    parent_comment_id TEXT, upvotes INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL
  );
  CREATE TABLE challenges (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL,
    creator_id TEXT NOT NULL REFERENCES users(id), start_date TEXT NOT NULL,
    end_date TEXT NOT NULL, habit_category TEXT NOT NULL DEFAULT 'Fitness',
    max_participants INTEGER NOT NULL DEFAULT 50
  );
  CREATE TABLE challenge_participants (
    id TEXT PRIMARY KEY, challenge_id TEXT NOT NULL REFERENCES challenges(id),
    user_id TEXT NOT NULL REFERENCES users(id), score INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE chat_messages (
    id TEXT PRIMARY KEY, challenge_id TEXT NOT NULL REFERENCES challenges(id),
    sender_id TEXT NOT NULL REFERENCES users(id), message TEXT NOT NULL, sent_at TEXT NOT NULL
  );
  CREATE TABLE notifications (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
    type TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL
  );
  CREATE TABLE user_badges (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
    badge_name TEXT NOT NULL, earned_at TEXT NOT NULL
  );
  CREATE TABLE direct_messages (
    id TEXT PRIMARY KEY, sender_id TEXT NOT NULL REFERENCES users(id),
    recipient_id TEXT NOT NULL REFERENCES users(id), message TEXT NOT NULL,
    sent_at TEXT NOT NULL, is_read INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE friendships (
    id TEXT PRIMARY KEY, requester_id TEXT NOT NULL REFERENCES users(id),
    addressee_id TEXT NOT NULL REFERENCES users(id), status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL, updated_at TEXT
  );
  CREATE TABLE communities (
    id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, description TEXT NOT NULL,
    icon TEXT, banner_color TEXT DEFAULT '#7c5cfc',
    banner_image TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    creator_id TEXT NOT NULL REFERENCES users(id),
    member_count INTEGER NOT NULL DEFAULT 1,
    invite_code TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL
  );
  CREATE TABLE community_members (
    id TEXT PRIMARY KEY, community_id TEXT NOT NULL REFERENCES communities(id),
    user_id TEXT NOT NULL REFERENCES users(id), role TEXT NOT NULL DEFAULT 'member',
    joined_at TEXT NOT NULL
  );
`);

// Seed Users
const today = new Date().toISOString().split('T')[0];
const insertUser = sqlite.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
const users = [
  ['u1', 'Shaker', 'shaker@rithmic.app', null, 'Building better habits, one day at a time 🚀', 'hashed_password_123', daysAgo(90), 350, 4, today, 12],
  ['u2', 'Sarah Chen', 'sarah@example.com', null, 'Fitness enthusiast & morning person 🌅', 'hashed_pw', daysAgo(60), 820, 6, today, 28],
  ['u3', 'Mike Johnson', 'mike@example.com', null, 'Early bird gets the worm 🐛', 'hashed_pw', daysAgo(45), 560, 5, today, 15],
  ['u4', 'Alex Rivera', 'alex@example.com', null, 'Mindfulness lover & yoga practitioner 🧘', 'hashed_pw', daysAgo(30), 1200, 8, today, 30],
  ['u5', 'Jordan Lee', 'jordan@example.com', null, 'Avid reader, 52 books/year 📚', 'hashed_pw', daysAgo(30), 950, 7, today, 22],
  ['u6', 'Emma Wilson', 'emma@example.com', null, 'Running every day, rain or shine 🏃‍♀️', 'hashed_pw', daysAgo(20), 430, 4, today, 8],
  ['u7', 'Chris Taylor', 'chris@example.com', null, 'Coder by day, meditator by night 💻', 'hashed_pw', daysAgo(15), 280, 3, today, 5],
];
users.forEach(u => insertUser.run(...u));

// Seed Habits (for u1 + other users)
const insertHabit = sqlite.prepare('INSERT INTO habits (id,name,category,start_hour,start_minute,end_hour,end_minute,days_of_week,frequency,reminder_enabled,created_at,current_streak,longest_streak,color_value,user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
const habits = [
  ['1', 'Morning Run', 'Fitness', 5, 30, 6, 0, '1,2,3,4,5,6,7', 'Daily', 1, daysAgo(30), 12, 18, 0x4ADE80, 'u1'],
  ['2', 'Read 30 Pages', 'Study', 8, 0, 9, 0, '1,2,3,4,5,6,7', 'Daily', 1, daysAgo(30), 7, 10, 0x6CB4EE, 'u1'],
  ['3', 'Meditate', 'Mindfulness', 6, 30, 7, 0, '1,2,3,4,5,6,7', 'Daily', 1, daysAgo(30), 4, 25, 0xCB6CE6, 'u1'],
  ['4', 'Drink Water', 'Health', 7, 0, 22, 0, '1,2,3,4,5,6,7', 'Daily', 1, daysAgo(30), 3, 5, 0xFFD93D, 'u1'],
  // Other users' habits
  ['5', 'HIIT Workout', 'Fitness', 6, 0, 6, 45, '1,3,5', 'Custom', 1, daysAgo(20), 15, 15, 0xFF4D6A, 'u2'],
  ['6', 'Yoga', 'Mindfulness', 7, 0, 7, 30, '1,2,3,4,5,6,7', 'Daily', 1, daysAgo(20), 20, 20, 0xCB6CE6, 'u2'],
  ['7', 'Wake Up at 5AM', 'Health', 5, 0, 5, 30, '1,2,3,4,5,6,7', 'Daily', 1, daysAgo(15), 10, 10, 0xFFD93D, 'u3'],
  ['8', 'Daily Meditation', 'Mindfulness', 6, 0, 6, 30, '1,2,3,4,5,6,7', 'Daily', 1, daysAgo(25), 25, 25, 0x9C27B0, 'u4'],
  ['9', 'Read a Chapter', 'Study', 21, 0, 22, 0, '1,2,3,4,5,6,7', 'Daily', 1, daysAgo(30), 30, 30, 0x6CB4EE, 'u5'],
];
habits.forEach(h => insertHabit.run(...h));

// Seed Habit Entries for dynamic dashboard (past 7 days for u1)
const insertEntry = sqlite.prepare('INSERT INTO habit_entries (id,habit_id,date,status,started_at,completed_at,duration_seconds) VALUES (?,?,?,?,?,?,?)');
for (let d = 6; d >= 0; d--) {
  const date = new Date(Date.now() - d * 86400000).toISOString().split('T')[0];
  const habitIds = ['1', '2', '3', '4'];
  for (const hid of habitIds) {
    const completed = d === 0 ? Math.random() > 0.5 : Math.random() > 0.3; // more likely completed for past days
    if (completed || d < 6) {
      const started = new Date(Date.now() - d * 86400000 + 3600000).toISOString();
      const finished = new Date(Date.now() - d * 86400000 + 7200000).toISOString();
      insertEntry.run(
        `e-${hid}-${d}`, hid, date,
        completed ? 'completed' : 'pending',
        started,
        completed ? finished : null,
        completed ? 1800 : null
      );
    }
  }
}

// Seed Posts
const insertPost = sqlite.prepare('INSERT INTO posts VALUES (?,?,?,?,?,?,?,?,?,?,?)');
const posts = [
  ['p1', 'u2', '30-day streak! My morning routine transformed my life', 'I started waking up at 5 AM every day. The first week was brutal, but now I can\'t imagine not doing it. My energy levels are through the roof!', 'Morning Routine', null, null, 124, 3, 2, daysAgo(2)],
  ['p2', 'u3', 'How I read 52 books this year using habit stacking', 'The trick is to attach reading to something you already do. I read during lunch and before bed. 30 minutes each session adds up fast!', 'Reading', null, null, 87, 5, 1, daysAgo(5)],
  ['p3', 'u4', 'Meditation changed my perspective on everything', 'Started with just 2 minutes a day. Now I do 20 minutes and the clarity it brings is incredible. Anxiety is way down.', 'Meditation', 'com1', null, 56, 2, 1, daysAgo(8)],
  ['p4', 'u1', 'My running journey: couch to 10K', 'Six months ago I couldn\'t run for 5 minutes. Today I finished my first 10K. Consistency beats intensity every single time.', 'Running', 'com2', null, 203, 1, 2, daysAgo(1)],
  ['p5', 'u5', 'Book of the month: Atomic Habits', 'This book literally changed the way I think about habits. The 1% improvement concept is so powerful.', null, 'com3', null, 45, 0, 0, daysAgo(3)],
  ['p6', 'u6', 'Best pre-run warmup routine', 'Dynamic stretches + light jog for 5 min. Reduced my injury rate to zero since I started doing this consistently.', null, 'com2', null, 32, 1, 0, daysAgo(4)],
];
posts.forEach(p => insertPost.run(...p));

// Seed Comments
const insertComment = sqlite.prepare('INSERT INTO comments VALUES (?,?,?,?,?,?,?)');
const comments = [
  ['c1', 'p1', 'u1', 'This is amazing! I\'m on day 12 of my morning run streak. Your post motivates me!', null, 15, daysAgo(1)],
  ['c2', 'p1', 'u5', 'Love this! What time do you wake up? I\'m trying to shift my schedule earlier.', null, 8, daysAgo(1)],
  ['c3', 'p2', 'u6', 'Habit stacking is a game changer! I do the same with my exercise routine.', null, 12, daysAgo(4)],
  ['c4', 'p3', 'u7', 'Which app do you use for meditation? I want to start but don\'t know where to begin.', null, 5, daysAgo(7)],
  ['c5', 'p4', 'u2', 'Incredible progress! Consistency really is key. Keep it up! 🔥', null, 20, daysAgo(1)],
  ['c6', 'p4', 'u3', 'Inspiring! I just started the couch-to-5K program myself.', null, 10, daysAgo(0)],
];
comments.forEach(c => insertComment.run(...c));

// Seed Challenges
const insertChallenge = sqlite.prepare('INSERT INTO challenges VALUES (?,?,?,?,?,?,?,?)');
const chs = [
  ['ch1', '30-Day Running Challenge', 'Run at least 2km every day for 30 days. Track your progress and compete with fellow runners!', 'u2', daysAgo(10), daysFromNow(20), 'Fitness', 50],
  ['ch2', 'Mindfulness March', 'Meditate for at least 10 minutes every day this month. Build inner peace together.', 'u4', daysAgo(5), daysFromNow(25), 'Mindfulness', 30],
  ['ch3', 'Reading Sprint', 'Read at least 20 pages daily. Challenge yourself to finish 2 books this month!', 'u3', daysFromNow(3), daysFromNow(33), 'Study', 40],
];
chs.forEach(ch => insertChallenge.run(...ch));

// Seed Challenge Participants
const insertPart = sqlite.prepare('INSERT INTO challenge_participants VALUES (?,?,?,?)');
[
  ['cp1', 'ch1', 'u1', 8], ['cp2', 'ch1', 'u2', 10], ['cp3', 'ch1', 'u3', 6],
  ['cp4', 'ch1', 'u5', 9], ['cp5', 'ch1', 'u6', 7],
  ['cp6', 'ch2', 'u1', 4], ['cp7', 'ch2', 'u4', 5], ['cp8', 'ch2', 'u7', 3],
].forEach(p => insertPart.run(...p));

// Seed Chat Messages
const insertChat = sqlite.prepare('INSERT INTO chat_messages VALUES (?,?,?,?,?)');
[
  ['cm1', 'ch1', 'u2', 'Hey everyone! Welcome to the 30-day running challenge! 🏃‍♂️', daysAgo(9)],
  ['cm2', 'ch1', 'u1', 'Excited to be here! Just finished my morning run 💪', daysAgo(9)],
  ['cm3', 'ch1', 'u3', 'Day 3 done! Getting easier already', daysAgo(7)],
  ['cm4', 'ch1', 'u5', 'Who else ran in the rain today? 🌧️ Still counts!', daysAgo(5)],
  ['cm5', 'ch1', 'u1', 'Rain runner here! Nothing stops us 🔥', daysAgo(5)],
].forEach(m => insertChat.run(...m));

// Seed Notifications
const insertNotif = sqlite.prepare('INSERT INTO notifications VALUES (?,?,?,?,?,?,?)');
[
  ['n1', 'u1', 'upvote', 'Post upvoted!', 'Sarah Chen upvoted your post "My running journey"', 0, daysAgo(0)],
  ['n2', 'u1', 'post_reply', 'New comment', 'Sarah Chen commented on your post', 0, daysAgo(1)],
  ['n3', 'u1', 'challenge_invite', 'Challenge Invite', 'Alex Rivera invited you to "Mindfulness March"', 0, daysAgo(2)],
  ['n4', 'u1', 'streak_milestone', '🔥 12-Day Streak!', 'You\'re on fire! Keep your Morning Run streak going', 1, daysAgo(3)],
  ['n5', 'u1', 'chat_message', 'New message', 'Jordan Lee sent a message in 30-Day Running Challenge', 1, daysAgo(5)],
  ['n6', 'u1', 'reminder', 'Time to Read! 📚', 'Your "Read 30 Pages" habit starts at 8:00 AM', 1, daysAgo(0)],
].forEach(n => insertNotif.run(...n));

// Seed Badges
const insertBadge = sqlite.prepare('INSERT INTO user_badges VALUES (?,?,?,?)');
[
  ['ub1', 'u1', '7-Day Warrior', daysAgo(45)],
  ['ub2', 'u1', '14-Day Fighter', daysAgo(30)],
  ['ub3', 'u1', '30-Day Legend', daysAgo(0)],
  // Other users badges
  ['ub4', 'u2', '7-Day Warrior', daysAgo(40)],
  ['ub5', 'u2', '14-Day Fighter', daysAgo(25)],
  ['ub6', 'u4', '7-Day Warrior', daysAgo(20)],
  ['ub7', 'u4', '14-Day Fighter', daysAgo(10)],
  ['ub8', 'u4', '30-Day Legend', daysAgo(3)],
  ['ub9', 'u5', '7-Day Warrior', daysAgo(22)],
  ['ub10', 'u5', '14-Day Fighter', daysAgo(15)],
  ['ub11', 'u5', '30-Day Legend', daysAgo(1)],
].forEach(b => insertBadge.run(...b));

// Seed Direct Messages
const insertDM = sqlite.prepare('INSERT INTO direct_messages VALUES (?,?,?,?,?,?)');
[
  ['dm1', 'u2', 'u1', 'Hey Shaker! Saw your 10K post. Amazing progress! 🏃', daysAgo(1), 0],
  ['dm2', 'u1', 'u2', 'Thanks Sarah! Your morning routine post inspired me to start', daysAgo(1), 1],
  ['dm3', 'u2', 'u1', 'That means a lot! Keep pushing 💪', daysAgo(0), 0],
  ['dm4', 'u4', 'u1', 'Want to try the mindfulness challenge together?', daysAgo(2), 0],
  ['dm5', 'u1', 'u4', 'Absolutely! I already joined 🧘', daysAgo(2), 1],
].forEach(d => insertDM.run(...d));

// Seed Friendships
const insertFriend = sqlite.prepare('INSERT INTO friendships VALUES (?,?,?,?,?,?)');
const friendships = [
  ['f1', 'u1', 'u2', 'accepted', daysAgo(30), daysAgo(29)],
  ['f2', 'u1', 'u4', 'accepted', daysAgo(20), daysAgo(19)],
  ['f3', 'u3', 'u1', 'pending', daysAgo(2), null],
  ['f4', 'u5', 'u1', 'pending', daysAgo(1), null],
  ['f5', 'u2', 'u3', 'accepted', daysAgo(25), daysAgo(24)],
  ['f6', 'u4', 'u5', 'accepted', daysAgo(15), daysAgo(14)],
  ['f7', 'u6', 'u7', 'accepted', daysAgo(10), daysAgo(9)],
];
friendships.forEach(f => insertFriend.run(...f));

// Seed Communities
const insertCom = sqlite.prepare('INSERT INTO communities VALUES (?,?,?,?,?,?,?,?,?,?,?)');
const comms = [
  ['com1', 'Mindful Habits', 'A community for mindfulness and meditation practitioners. Share your journey and support others.', '🧘', '#9C27B0', null, 'Mindfulness', 'u4', 4, 'MndflH8b', daysAgo(40)],
  ['com2', 'Runners Hub', 'For runners of all levels — share routes, tips, race results, and motivation!', '🏃', '#4ADE80', null, 'Fitness', 'u2', 5, 'RunH3bXk', daysAgo(35)],
  ['com3', 'Book Worms', 'Read together, discuss books, and track reading goals. All genres welcome!', '📚', '#6CB4EE', null, 'Study', 'u5', 3, 'BkWrm9Tz', daysAgo(25)],
];
comms.forEach(cm => insertCom.run(...cm));

// Seed Community Members
const insertCM = sqlite.prepare('INSERT INTO community_members VALUES (?,?,?,?,?)');
[
  ['cm01', 'com1', 'u4', 'admin', daysAgo(40)],
  ['cm02', 'com1', 'u1', 'member', daysAgo(35)],
  ['cm03', 'com1', 'u7', 'member', daysAgo(30)],
  ['cm04', 'com1', 'u3', 'member', daysAgo(20)],
  ['cm05', 'com2', 'u2', 'admin', daysAgo(35)],
  ['cm06', 'com2', 'u1', 'member', daysAgo(30)],
  ['cm07', 'com2', 'u3', 'member', daysAgo(25)],
  ['cm08', 'com2', 'u6', 'member', daysAgo(15)],
  ['cm09', 'com2', 'u5', 'member', daysAgo(10)],
  ['cm10', 'com3', 'u5', 'admin', daysAgo(25)],
  ['cm11', 'com3', 'u1', 'member', daysAgo(20)],
  ['cm12', 'com3', 'u3', 'member', daysAgo(15)],
].forEach(m => insertCM.run(...m));

console.log('✅ Database seeded successfully!');
console.log(`   ${users.length} users, ${habits.length} habits, ${posts.length} posts, ${chs.length} challenges, ${comms.length} communities, ${friendships.length} friendships`);
