import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../profile/data/models/badge_model.dart';

/// Provider: dashboard time range
final dashboardRangeProvider = StateProvider<String>((ref) => 'This week');

/// Provider: momentum score (computed)
final momentumScoreProvider = Provider<int>((ref) {
  // In production, this would compute from habit completion data
  return 64;
});

/// Provider: completion percentage
final completionPercentProvider = Provider<double>((ref) {
  return 0.40; // 40%
});

/// Provider: total wins
final totalWinsProvider = Provider<int>((ref) {
  return 15;
});

/// Provider: total habits target
final totalTargetProvider = Provider<int>((ref) {
  return 20;
});

/// Provider: user badges
final userBadgesProvider = Provider<List<BadgeModel>>((ref) {
  final allBadges = BadgeModel.allBadges;
  // Demo: user has earned first 3 badges
  return allBadges.asMap().entries.map((entry) {
    if (entry.key < 3) {
      return BadgeModel(
        id: entry.value.id,
        name: entry.value.name,
        description: entry.value.description,
        tier: entry.value.tier,
        requiredStreak: entry.value.requiredStreak,
        earnedAt: DateTime.now().subtract(Duration(days: entry.key * 15)),
      );
    }
    return entry.value;
  }).toList();
});

/// Provider: weekly streak data
final weeklyStreakProvider = Provider<List<String>>((ref) {
  return ['completed', 'completed', 'missed', 'completed', 'completed', 'completed', 'pending'];
});

/// Provider: chart data points
final chartDataProvider = Provider<List<double>>((ref) {
  return [30, 42, 55, 48, 64, 58, 64];
});


