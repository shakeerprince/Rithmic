import 'package:flutter/material.dart';

/// Habit model representing a user's habit
class HabitModel {
  final String id;
  final String name;
  final String category;
  final int startHour;
  final int startMinute;
  final int endHour;
  final int endMinute;
  final List<int> daysOfWeek; // 1=Mon..7=Sun
  final String frequency; // daily, weekly, custom
  final bool reminderEnabled;
  final DateTime createdAt;
  int currentStreak;
  int longestStreak;
  final int colorValue;
  final String? iconName;
  final String userId;

  HabitModel({
    required this.id,
    required this.name,
    this.category = 'Custom',
    this.startHour = 6,
    this.startMinute = 0,
    this.endHour = 7,
    this.endMinute = 0,
    this.daysOfWeek = const [1, 2, 3, 4, 5, 6, 7],
    this.frequency = 'Daily',
    this.reminderEnabled = true,
    required this.createdAt,
    this.currentStreak = 0,
    this.longestStreak = 0,
    this.colorValue = 0xFFC8E600,
    this.iconName,
    this.userId = 'local',
  });

  TimeOfDay get startTime => TimeOfDay(hour: startHour, minute: startMinute);
  TimeOfDay get endTime => TimeOfDay(hour: endHour, minute: endMinute);

  String get timeRange {
    String fmt(int h, int m) {
      final period = h >= 12 ? 'PM' : 'AM';
      final hour = h == 0 ? 12 : (h > 12 ? h - 12 : h);
      return '${hour.toString()}:${m.toString().padLeft(2, '0')} $period';
    }
    return '${fmt(startHour, startMinute)} - ${fmt(endHour, endMinute)}';
  }

  Color get color => Color(colorValue);

  HabitModel copyWith({
    String? name,
    String? category,
    int? startHour,
    int? startMinute,
    int? endHour,
    int? endMinute,
    List<int>? daysOfWeek,
    String? frequency,
    bool? reminderEnabled,
    int? currentStreak,
    int? longestStreak,
    int? colorValue,
    String? iconName,
  }) {
    return HabitModel(
      id: id,
      name: name ?? this.name,
      category: category ?? this.category,
      startHour: startHour ?? this.startHour,
      startMinute: startMinute ?? this.startMinute,
      endHour: endHour ?? this.endHour,
      endMinute: endMinute ?? this.endMinute,
      daysOfWeek: daysOfWeek ?? this.daysOfWeek,
      frequency: frequency ?? this.frequency,
      reminderEnabled: reminderEnabled ?? this.reminderEnabled,
      createdAt: createdAt,
      currentStreak: currentStreak ?? this.currentStreak,
      longestStreak: longestStreak ?? this.longestStreak,
      colorValue: colorValue ?? this.colorValue,
      iconName: iconName ?? this.iconName,
      userId: userId,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'category': category,
    'startHour': startHour,
    'startMinute': startMinute,
    'endHour': endHour,
    'endMinute': endMinute,
    'daysOfWeek': daysOfWeek,
    'frequency': frequency,
    'reminderEnabled': reminderEnabled,
    'createdAt': createdAt.toIso8601String(),
    'currentStreak': currentStreak,
    'longestStreak': longestStreak,
    'colorValue': colorValue,
    'iconName': iconName,
    'userId': userId,
  };

  factory HabitModel.fromJson(Map<String, dynamic> json) => HabitModel(
    id: json['id'] as String,
    name: json['name'] as String,
    category: json['category'] as String? ?? 'Custom',
    startHour: json['startHour'] as int? ?? 6,
    startMinute: json['startMinute'] as int? ?? 0,
    endHour: json['endHour'] as int? ?? 7,
    endMinute: json['endMinute'] as int? ?? 0,
    daysOfWeek: (json['daysOfWeek'] as List?)?.cast<int>() ?? [1,2,3,4,5,6,7],
    frequency: json['frequency'] as String? ?? 'Daily',
    reminderEnabled: json['reminderEnabled'] as bool? ?? true,
    createdAt: DateTime.parse(json['createdAt'] as String),
    currentStreak: json['currentStreak'] as int? ?? 0,
    longestStreak: json['longestStreak'] as int? ?? 0,
    colorValue: json['colorValue'] as int? ?? 0xFFC8E600,
    iconName: json['iconName'] as String?,
    userId: json['userId'] as String? ?? 'local',
  );
}
