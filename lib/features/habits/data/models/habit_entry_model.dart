/// Habit entry — a single log of habit activity for a specific day
class HabitEntryModel {
  final String id;
  final String habitId;
  final DateTime date;
  String status; // completed, missed, in_progress, pending
  int durationSeconds;
  DateTime? startedAt;
  DateTime? completedAt;

  HabitEntryModel({
    required this.id,
    required this.habitId,
    required this.date,
    this.status = 'pending',
    this.durationSeconds = 0,
    this.startedAt,
    this.completedAt,
  });

  bool get isCompleted => status == 'completed';
  bool get isMissed => status == 'missed';
  bool get isInProgress => status == 'in_progress';

  HabitEntryModel copyWith({
    String? status,
    int? durationSeconds,
    DateTime? startedAt,
    DateTime? completedAt,
  }) {
    return HabitEntryModel(
      id: id,
      habitId: habitId,
      date: date,
      status: status ?? this.status,
      durationSeconds: durationSeconds ?? this.durationSeconds,
      startedAt: startedAt ?? this.startedAt,
      completedAt: completedAt ?? this.completedAt,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'habitId': habitId,
    'date': date.toIso8601String(),
    'status': status,
    'durationSeconds': durationSeconds,
    'startedAt': startedAt?.toIso8601String(),
    'completedAt': completedAt?.toIso8601String(),
  };

  factory HabitEntryModel.fromJson(Map<String, dynamic> json) => HabitEntryModel(
    id: json['id'] as String,
    habitId: json['habitId'] as String,
    date: DateTime.parse(json['date'] as String),
    status: json['status'] as String? ?? 'pending',
    durationSeconds: json['durationSeconds'] as int? ?? 0,
    startedAt: json['startedAt'] != null ? DateTime.parse(json['startedAt'] as String) : null,
    completedAt: json['completedAt'] != null ? DateTime.parse(json['completedAt'] as String) : null,
  );
}
