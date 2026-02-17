/// HabitCircle App Constants
class AppConstants {
  AppConstants._();

  // App Info
  static const String appName = 'HabitCircle';
  static const String appVersion = '1.0.0';
  static const String appTagline = 'Build habits. Together.';

  // Habit Categories
  static const List<String> habitCategories = [
    'Health',
    'Fitness',
    'Study',
    'Work',
    'Mindfulness',
    'Custom',
  ];

  // Habit Frequencies
  static const List<String> frequencies = [
    'Daily',
    'Weekly',
    'Custom',
  ];

  // Days of week
  static const List<String> daysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  static const List<String> daysFull = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
  ];

  // Badge Tiers
  static const List<String> badgeTiers = ['Bronze', 'Silver', 'Gold', 'Diamond'];

  // Badge Milestones (streak days required)
  static const Map<String, int> badgeMilestones = {
    '7-Day Warrior': 7,
    '14-Day Fighter': 14,
    '30-Day Legend': 30,
    '60-Day Master': 60,
    '100-Day Champion': 100,
    '365-Day Immortal': 365,
  };

  // Community Post Filters
  static const List<String> postFilters = ['Hot', 'New', 'Top'];

  // Dashboard Time Ranges
  static const List<String> dashboardRanges = ['This week', 'This month', 'All time'];

  // Notification Types
  static const String notifPostReply = 'post_reply';
  static const String notifUpvote = 'upvote';
  static const String notifChallengeInvite = 'challenge_invite';
  static const String notifChatMessage = 'chat_message';
  static const String notifStreakMilestone = 'streak_milestone';
  static const String notifReminder = 'reminder';
}
