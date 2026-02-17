import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/widgets/hc_card.dart';
import '../../../../core/widgets/hc_date_selector.dart';
import '../../../../core/widgets/hc_notification_bell.dart';
import '../../../../core/utils/date_utils.dart';
import '../../domain/providers/habit_providers.dart';
import '../../../notifications/domain/providers/notification_providers.dart';

class TasksScreen extends ConsumerWidget {
  const TasksScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final habits = ref.watch(habitsProvider);
    final selectedDate = ref.watch(selectedDateProvider);
    final weekDates = HCDateUtils.getCurrentWeekDates();
    final entries = ref.watch(todayEntriesProvider);
    final unread = ref.watch(unreadCountProvider);
    final runningId = ref.watch(runningHabitIdProvider);

    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ─── Header ───────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.local_fire_department_rounded,
                          color: theme.colorScheme.primary, size: 22),
                      const SizedBox(width: 4),
                      Text(
                        '${habits.fold<int>(0, (sum, h) => sum + h.currentStreak)}',
                        style: theme.textTheme.titleMedium,
                      ),
                    ],
                  ),
                  Text('My Tasks', style: theme.textTheme.titleLarge),
                  HCNotificationBell(
                    unreadCount: unread,
                    onTap: () => context.push('/notifications'),
                  ),
                ],
              ),
            ),

            // ─── Week Date Selector ─────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 12, 12, 0),
              child: HCDateSelector(
                dates: weekDates,
                selectedDate: selectedDate,
                onDateSelected: (date) {
                  ref.read(selectedDateProvider.notifier).state = date;
                },
              ),
            ),

            const Divider(height: 24),

            // ─── Today Label ────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                HCDateUtils.isToday(selectedDate) ? 'Today' : HCDateUtils.formatDateMedium(selectedDate),
                style: theme.textTheme.headlineSmall,
              ),
            ),

            const SizedBox(height: 8),

            // ─── Habits List ────────────────────────
            Expanded(
              child: habits.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.add_task_rounded,
                              size: 64,
                              color: theme.colorScheme.primary.withValues(alpha: 0.3)),
                          const SizedBox(height: 16),
                          Text('No habits yet',
                              style: theme.textTheme.titleMedium?.copyWith(
                                color: theme.textTheme.bodySmall?.color,
                              )),
                          const SizedBox(height: 8),
                          Text('Tap + to create your first habit',
                              style: theme.textTheme.bodySmall),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: habits.length,
                      itemBuilder: (context, index) {
                        final habit = habits[index];
                        final status = entries[habit.id]?.status ?? 'pending';
                        final isRunning = runningId == habit.id;
                        final isCompleted = status == 'completed';

                        return HCCard(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: EdgeInsets.zero,
                          color: isRunning
                              ? theme.colorScheme.primary.withValues(alpha: 0.12)
                              : null,
                          onTap: isRunning ? null : null,
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(16),
                              border: isRunning
                                  ? Border.all(
                                      color: theme.colorScheme.primary.withValues(alpha: 0.5),
                                      width: 1.5,
                                    )
                                  : null,
                            ),
                            child: Row(
                              children: [
                                // Status circle
                                Container(
                                  width: 28,
                                  height: 28,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: isCompleted
                                        ? theme.colorScheme.primary
                                        : Colors.transparent,
                                    border: Border.all(
                                      color: isCompleted
                                          ? theme.colorScheme.primary
                                          : theme.colorScheme.outline.withValues(alpha: 0.5),
                                      width: 2,
                                    ),
                                  ),
                                  child: isCompleted
                                      ? Icon(Icons.check_rounded,
                                          size: 16,
                                          color: theme.colorScheme.onPrimary)
                                      : null,
                                ),
                                const SizedBox(width: 12),

                                // Habit info
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        habit.name,
                                        style: theme.textTheme.titleMedium?.copyWith(
                                          decoration: isCompleted
                                              ? TextDecoration.lineThrough
                                              : null,
                                          color: isCompleted
                                              ? theme.textTheme.bodySmall?.color
                                              : null,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Row(
                                        children: [
                                          Icon(Icons.access_time_rounded,
                                              size: 13,
                                              color: theme.textTheme.bodySmall?.color),
                                          const SizedBox(width: 4),
                                          Text(
                                            habit.timeRange,
                                            style: theme.textTheme.bodySmall,
                                          ),
                                          const SizedBox(width: 12),
                                          Icon(Icons.refresh_rounded,
                                              size: 13,
                                              color: theme.textTheme.bodySmall?.color),
                                          const SizedBox(width: 4),
                                          Text(
                                            habit.frequency,
                                            style: theme.textTheme.bodySmall,
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),

                                // Start/Stop button
                                if (!isCompleted)
                                  GestureDetector(
                                    onTap: () {
                                      if (isRunning) {
                                        ref.read(todayEntriesProvider.notifier).completeHabit(habit.id);
                                        ref.read(runningHabitIdProvider.notifier).state = null;
                                      } else {
                                        ref.read(todayEntriesProvider.notifier).startHabit(habit.id);
                                        ref.read(runningHabitIdProvider.notifier).state = habit.id;
                                      }
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 16, vertical: 8),
                                      decoration: BoxDecoration(
                                        color: isRunning
                                            ? theme.colorScheme.primary
                                            : theme.colorScheme.primary.withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(
                                          color: theme.colorScheme.primary.withValues(alpha: 0.3),
                                        ),
                                      ),
                                      child: Text(
                                        isRunning ? 'Stop' : 'Start',
                                        style: theme.textTheme.labelMedium?.copyWith(
                                          color: isRunning
                                              ? theme.colorScheme.onPrimary
                                              : theme.colorScheme.primary,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/create-habit'),
        child: const Icon(Icons.add_rounded, size: 28),
      ),
    );
  }
}
