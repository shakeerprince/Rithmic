import 'package:intl/intl.dart';

/// Date utility helpers
class HCDateUtils {
  HCDateUtils._();

  /// Get the list of dates for the current week (Mon-Sun)
  static List<DateTime> getCurrentWeekDates() {
    final now = DateTime.now();
    final monday = now.subtract(Duration(days: now.weekday - 1));
    return List.generate(7, (i) => monday.add(Duration(days: i)));
  }

  /// Check if two dates are the same day
  static bool isSameDay(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  /// Check if a date is today
  static bool isToday(DateTime date) {
    return isSameDay(date, DateTime.now());
  }

  /// Format time like "5:30 AM"
  static String formatTime(int hour, int minute) {
    final dt = DateTime(2000, 1, 1, hour, minute);
    return DateFormat('h:mm a').format(dt);
  }

  /// Format date like "Mon, 10"
  static String formatDayShort(DateTime date) {
    return DateFormat('EEE').format(date);
  }

  /// Format date like "Mon, Jan 10"
  static String formatDateMedium(DateTime date) {
    return DateFormat('EEE, MMM d').format(date);
  }

  /// Format date like "January 10, 2024"
  static String formatDateFull(DateTime date) {
    return DateFormat('MMMM d, y').format(date);
  }

  /// Get greeting based on time of day
  static String getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  /// Calculate streak from a list of completion dates
  static int calculateStreak(List<DateTime> completedDates) {
    if (completedDates.isEmpty) return 0;

    final sorted = completedDates.map((d) => DateTime(d.year, d.month, d.day)).toList()
      ..sort((a, b) => b.compareTo(a));

    final today = DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day);
    final yesterday = today.subtract(const Duration(days: 1));

    // Streak must start from today or yesterday
    if (!isSameDay(sorted.first, today) && !isSameDay(sorted.first, yesterday)) {
      return 0;
    }

    int streak = 1;
    for (int i = 1; i < sorted.length; i++) {
      final diff = sorted[i - 1].difference(sorted[i]).inDays;
      if (diff == 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
}
