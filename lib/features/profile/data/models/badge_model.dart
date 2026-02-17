/// Badge model for user profile achievement system
class BadgeModel {
  final String id;
  final String name;
  final String description;
  final String tier; // bronze, silver, gold, diamond
  final int requiredStreak;
  final DateTime? earnedAt;

  BadgeModel({
    required this.id,
    required this.name,
    required this.description,
    required this.tier,
    required this.requiredStreak,
    this.earnedAt,
  });

  bool get isEarned => earnedAt != null;

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'description': description,
    'tier': tier,
    'requiredStreak': requiredStreak,
    'earnedAt': earnedAt?.toIso8601String(),
  };

  factory BadgeModel.fromJson(Map<String, dynamic> json) => BadgeModel(
    id: json['id'] as String,
    name: json['name'] as String,
    description: json['description'] as String,
    tier: json['tier'] as String,
    requiredStreak: json['requiredStreak'] as int,
    earnedAt: json['earnedAt'] != null ? DateTime.parse(json['earnedAt'] as String) : null,
  );

  /// Default badge definitions
  static List<BadgeModel> get allBadges => [
    BadgeModel(id: 'b1', name: '7-Day Warrior', description: 'Complete a 7-day streak', tier: 'bronze', requiredStreak: 7),
    BadgeModel(id: 'b2', name: '14-Day Fighter', description: 'Complete a 14-day streak', tier: 'bronze', requiredStreak: 14),
    BadgeModel(id: 'b3', name: '30-Day Legend', description: 'Complete a 30-day streak', tier: 'silver', requiredStreak: 30),
    BadgeModel(id: 'b4', name: '60-Day Master', description: 'Complete a 60-day streak', tier: 'silver', requiredStreak: 60),
    BadgeModel(id: 'b5', name: '100-Day Champion', description: 'Complete a 100-day streak', tier: 'gold', requiredStreak: 100),
    BadgeModel(id: 'b6', name: '365-Day Immortal', description: 'Complete a full year streak', tier: 'diamond', requiredStreak: 365),
  ];
}
