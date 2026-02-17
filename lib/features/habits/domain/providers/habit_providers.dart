
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../../data/models/habit_model.dart';
import '../../data/models/habit_entry_model.dart';

const _uuid = Uuid();

/// Mock data for demo
List<HabitModel> _demoHabits = [
  HabitModel(
    id: '1',
    name: 'Morning Run',
    category: 'Fitness',
    startHour: 5,
    startMinute: 30,
    endHour: 6,
    endMinute: 0,
    frequency: 'Daily',
    createdAt: DateTime.now().subtract(const Duration(days: 30)),
    currentStreak: 12,
    longestStreak: 18,
    colorValue: 0xFF4ADE80,
  ),
  HabitModel(
    id: '2',
    name: 'Read 30 Pages',
    category: 'Study',
    startHour: 8,
    startMinute: 0,
    endHour: 9,
    endMinute: 0,
    frequency: 'Daily',
    createdAt: DateTime.now().subtract(const Duration(days: 14)),
    currentStreak: 7,
    longestStreak: 10,
    colorValue: 0xFF6CB4EE,
  ),
  HabitModel(
    id: '3',
    name: 'Meditate',
    category: 'Mindfulness',
    startHour: 6,
    startMinute: 30,
    endHour: 7,
    endMinute: 0,
    frequency: 'Daily',
    createdAt: DateTime.now().subtract(const Duration(days: 60)),
    currentStreak: 4,
    longestStreak: 25,
    colorValue: 0xFFCB6CE6,
  ),
  HabitModel(
    id: '4',
    name: 'Drink Water',
    category: 'Health',
    startHour: 7,
    startMinute: 0,
    endHour: 22,
    endMinute: 0,
    frequency: 'Daily',
    createdAt: DateTime.now().subtract(const Duration(days: 7)),
    currentStreak: 3,
    longestStreak: 5,
    colorValue: 0xFFFFD93D,
  ),
];

/// Provider: all habits
final habitsProvider = StateNotifierProvider<HabitsNotifier, List<HabitModel>>(
  (ref) => HabitsNotifier(),
);

/// Provider: active habit entries for today
final todayEntriesProvider = StateNotifierProvider<TodayEntriesNotifier, Map<String, HabitEntryModel>>(
  (ref) => TodayEntriesNotifier(),
);

/// Provider: selected date
final selectedDateProvider = StateProvider<DateTime>((ref) => DateTime.now());

/// Provider: currently running habit ID
final runningHabitIdProvider = StateProvider<String?>((ref) => null);

class HabitsNotifier extends StateNotifier<List<HabitModel>> {
  HabitsNotifier() : super(_demoHabits);

  void addHabit(HabitModel habit) {
    state = [...state, habit];
  }

  void removeHabit(String id) {
    state = state.where((h) => h.id != id).toList();
  }

  void updateHabit(HabitModel habit) {
    state = state.map((h) => h.id == habit.id ? habit : h).toList();
  }

  HabitModel? getById(String id) {
    try {
      return state.firstWhere((h) => h.id == id);
    } catch (_) {
      return null;
    }
  }
}

class TodayEntriesNotifier extends StateNotifier<Map<String, HabitEntryModel>> {
  TodayEntriesNotifier() : super({});

  void startHabit(String habitId) {
    final entry = HabitEntryModel(
      id: _uuid.v4(),
      habitId: habitId,
      date: DateTime.now(),
      status: 'in_progress',
      startedAt: DateTime.now(),
    );
    state = {...state, habitId: entry};
  }

  void completeHabit(String habitId) {
    final existing = state[habitId];
    if (existing != null) {
      final completed = existing.copyWith(
        status: 'completed',
        completedAt: DateTime.now(),
        durationSeconds: DateTime.now().difference(existing.startedAt ?? DateTime.now()).inSeconds,
      );
      state = {...state, habitId: completed};
    }
  }

  void stopHabit(String habitId) {
    final existing = state[habitId];
    if (existing != null) {
      final stopped = existing.copyWith(
        status: 'pending',
        durationSeconds: DateTime.now().difference(existing.startedAt ?? DateTime.now()).inSeconds,
      );
      state = {...state, habitId: stopped};
    }
  }

  String getStatus(String habitId) {
    return state[habitId]?.status ?? 'pending';
  }
}
