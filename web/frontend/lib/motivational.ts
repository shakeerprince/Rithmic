// Motivational quotes for different contexts
const HABIT_COMPLETE_QUOTES = [
    "You're unstoppable! 💪",
    "Another one bites the dust! 🎯",
    "Crushing it! Keep going! 🔥",
    "Small steps, big results! 🚀",
    "That's the spirit! 🌟",
    "Winners never quit! 🏆",
    "You showed up. That's what matters! ✨",
    "Building habits, building character! 💎",
    "The grind pays off! 💰",
    "Discipline equals freedom! 🦅",
    "You just outworked yesterday! ⚡",
    "Champions are made in the shadows! 🥇",
    "One more day of excellence! 🎖️",
    "This is your superpower! 🦸",
    "Consistency is the key! 🔑",
];

const STREAK_QUOTES = [
    "🔥 You're on fire! Keep that streak alive!",
    "⚡ Unstoppable streak! You're a machine!",
    "🏆 Streak warrior! Nothing can stop you!",
    "💪 The streak is real! Keep punching!",
    "🌟 Your dedication is inspiring!",
];

const LOGIN_QUOTES = [
    "Welcome back, champion! 🏆",
    "Ready to crush another day? 💪",
    "The comeback is always stronger! 🔥",
    "Your habits await! Let's go! 🚀",
    "Good to see you! Time to grind! ⚡",
];

const LEVEL_UP_QUOTES = [
    "LEVEL UP! You're evolving! 🎮",
    "New level unlocked! Keep ascending! 🚀",
    "You've ascended! The grind pays off! 💎",
    "Power increased! You're unstoppable! ⚡",
];

function getRandomQuote(quotes: string[]): string {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getHabitCompleteQuote(): string {
    return getRandomQuote(HABIT_COMPLETE_QUOTES);
}

export function getStreakQuote(): string {
    return getRandomQuote(STREAK_QUOTES);
}

export function getLoginQuote(): string {
    return getRandomQuote(LOGIN_QUOTES);
}

export function getLevelUpQuote(): string {
    return getRandomQuote(LEVEL_UP_QUOTES);
}
