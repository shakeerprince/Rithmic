import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/widgets/hc_card.dart';
import '../../../../core/widgets/hc_badge_icon.dart';
import '../../../../core/widgets/hc_streak_row.dart';

import '../../../dashboard/domain/providers/dashboard_providers.dart';
import '../../../habits/domain/providers/habit_providers.dart';
import '../../../../core/providers/theme_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final badges = ref.watch(userBadgesProvider);
    final habits = ref.watch(habitsProvider);
    final isDark = ref.watch(themeProvider);
    final streakData = ref.watch(weeklyStreakProvider);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // ─── Profile Header ─────────────────────
              CircleAvatar(
                radius: 44,
                backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.2),
                child: Text(
                  'S',
                  style: TextStyle(
                    color: theme.colorScheme.primary,
                    fontWeight: FontWeight.w800,
                    fontSize: 32,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text('Shaker', style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w800,
              )),
              Text('@shakerprince',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.textTheme.bodySmall?.color,
                  )),
              const SizedBox(height: 8),
              Text('Building better habits, one day at a time 🚀',
                  style: theme.textTheme.bodySmall,
                  textAlign: TextAlign.center),

              const SizedBox(height: 16),

              // Stats row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _StatItem(
                    value: '${habits.length}',
                    label: 'Habits',
                    theme: theme,
                  ),
                  _StatItem(
                    value: '${habits.fold<int>(0, (sum, h) => sum + h.currentStreak)}',
                    label: 'Streak',
                    theme: theme,
                  ),
                  _StatItem(
                    value: '${badges.where((b) => b.isEarned).length}',
                    label: 'Badges',
                    theme: theme,
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // ─── Badges Section ─────────────────────
              Align(
                alignment: Alignment.centerLeft,
                child: Text('🏅 Badges',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    )),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: badges.map((badge) {
                  return Column(
                    children: [
                      HCBadgeIcon(
                        name: badge.name,
                        tier: badge.tier,
                        earned: badge.isEarned,
                        size: 52,
                      ),
                      const SizedBox(height: 4),
                      SizedBox(
                        width: 72,
                        child: Text(
                          badge.name,
                          style: theme.textTheme.labelSmall?.copyWith(
                            color: badge.isEarned
                                ? null
                                : theme.textTheme.bodySmall?.color,
                            fontSize: 9,
                          ),
                          textAlign: TextAlign.center,
                          maxLines: 2,
                        ),
                      ),
                    ],
                  );
                }).toList(),
              ),

              const SizedBox(height: 24),

              // ─── Weekly Streak ──────────────────────
              HCCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('This Week',
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                        )),
                    const SizedBox(height: 12),
                    HCStreakRow(
                      statuses: streakData,
                      dayLabels: const ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // ─── Settings ───────────────────────────
              Align(
                alignment: Alignment.centerLeft,
                child: Text('Settings',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    )),
              ),
              const SizedBox(height: 12),

              HCCard(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 0),
                child: Column(
                  children: [
                    SwitchListTile(
                      title: Text('Dark Neon Theme', style: theme.textTheme.bodyMedium),
                      subtitle: Text(
                        isDark ? 'Productivity mode' : 'Lifestyle mode',
                        style: theme.textTheme.bodySmall,
                      ),
                      secondary: Icon(
                        isDark ? Icons.dark_mode_rounded : Icons.light_mode_rounded,
                        color: theme.colorScheme.primary,
                      ),
                      value: isDark,

                      onChanged: (v) {
                        ref.read(themeProvider.notifier).toggle();
                      },
                      activeTrackColor: theme.colorScheme.primary,
                    ),
                    Divider(color: theme.colorScheme.outline.withValues(alpha: 0.2)),
                    ListTile(
                      leading: Icon(Icons.notifications_outlined,
                          color: theme.colorScheme.primary),
                      title: Text('Notifications', style: theme.textTheme.bodyMedium),
                      trailing: const Icon(Icons.chevron_right_rounded, size: 20),
                    ),
                    Divider(color: theme.colorScheme.outline.withValues(alpha: 0.2)),
                    ListTile(
                      leading: Icon(Icons.info_outline_rounded,
                          color: theme.colorScheme.primary),
                      title: Text('About', style: theme.textTheme.bodyMedium),
                      trailing: const Icon(Icons.chevron_right_rounded, size: 20),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;
  final ThemeData theme;

  const _StatItem({required this.value, required this.label, required this.theme});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: theme.textTheme.headlineSmall?.copyWith(
          fontWeight: FontWeight.w800,
        )),
        Text(label, style: theme.textTheme.bodySmall),
      ],
    );
  }
}
