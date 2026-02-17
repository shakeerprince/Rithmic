import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:fl_chart/fl_chart.dart';
import '../../../../core/widgets/hc_card.dart';
import '../../../../core/widgets/hc_chip.dart';
import '../../../../core/widgets/hc_progress_ring.dart';
import '../../../../core/widgets/hc_streak_row.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/constants/app_constants.dart';
import '../../domain/providers/dashboard_providers.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final range = ref.watch(dashboardRangeProvider);
    final momentum = ref.watch(momentumScoreProvider);
    final completion = ref.watch(completionPercentProvider);
    final totalWins = ref.watch(totalWinsProvider);
    final totalTarget = ref.watch(totalTargetProvider);
    final streakData = ref.watch(weeklyStreakProvider);
    final chartData = ref.watch(chartDataProvider);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ─── Header ─────────────────────────────
              Center(
                child: Text('Dashboard', style: theme.textTheme.titleLarge),
              ),
              const SizedBox(height: 16),

              // ─── Time Range Selector ────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: AppConstants.dashboardRanges.map((r) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: HCChip(
                      label: r,
                      selected: range == r,
                      onTap: () {
                        ref.read(dashboardRangeProvider.notifier).state = r;
                      },
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),

              // ─── Momentum Score ─────────────────────
              HCCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Momentum', style: theme.textTheme.headlineSmall),
                            const SizedBox(height: 4),
                            Text(
                              '+10 from last week!',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: AppColors.neonPrimary,
                              ),
                            ),
                          ],
                        ),
                        HCProgressRing(
                          progress: momentum / 100,
                          size: 80,
                          strokeWidth: 8,
                          center: Text(
                            '$momentum',
                            style: theme.textTheme.headlineMedium?.copyWith(
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Chart
                    SizedBox(
                      height: 160,
                      child: LineChart(
                        LineChartData(
                          gridData: FlGridData(
                            show: true,
                            drawVerticalLine: false,
                            horizontalInterval: 20,
                            getDrawingHorizontalLine: (value) => FlLine(
                              color: theme.colorScheme.outline.withValues(alpha: 0.1),
                              strokeWidth: 1,
                            ),
                          ),
                          titlesData: FlTitlesData(
                            leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            bottomTitles: AxisTitles(
                              sideTitles: SideTitles(
                                showTitles: true,
                                getTitlesWidget: (value, meta) {
                                  final days = ['5', '6', '7', '8', '9', '10', '11'];
                                  final idx = value.toInt();
                                  if (idx >= 0 && idx < days.length) {
                                    return Text(days[idx],
                                        style: theme.textTheme.labelSmall?.copyWith(
                                          color: theme.textTheme.bodySmall?.color,
                                        ));
                                  }
                                  return const Text('');
                                },
                              ),
                            ),
                          ),
                          borderData: FlBorderData(show: false),
                          lineBarsData: [
                            LineChartBarData(
                              spots: chartData.asMap().entries
                                  .map((e) => FlSpot(e.key.toDouble(), e.value))
                                  .toList(),
                              isCurved: true,
                              color: theme.colorScheme.primary,
                              barWidth: 3,
                              dotData: const FlDotData(show: false),
                              belowBarData: BarAreaData(
                                show: true,
                                color: theme.colorScheme.primary.withValues(alpha: 0.1),
                              ),
                            ),
                          ],
                          minY: 0,
                          maxY: 100,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // ─── Stats Row ──────────────────────────
              Row(
                children: [
                  Expanded(
                    child: HCCard(
                      child: Column(
                        children: [
                          Text('Avg Daily Completion',
                              style: theme.textTheme.labelSmall?.copyWith(
                                color: theme.textTheme.bodySmall?.color,
                              )),
                          const SizedBox(height: 12),
                          HCProgressRing(
                            progress: completion,
                            size: 70,
                            strokeWidth: 7,
                            center: Text(
                              '${(completion * 100).toInt()}%',
                              style: theme.textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: HCCard(
                      child: Column(
                        children: [
                          Text('Total Wins',
                              style: theme.textTheme.labelSmall?.copyWith(
                                color: theme.textTheme.bodySmall?.color,
                              )),
                          const SizedBox(height: 12),
                          HCProgressRing(
                            progress: totalWins / totalTarget,
                            size: 70,
                            strokeWidth: 7,
                            center: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  '$totalWins',
                                  style: theme.textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                                Text(
                                  'of $totalTarget',
                                  style: theme.textTheme.labelSmall?.copyWith(
                                    color: theme.textTheme.bodySmall?.color,
                                    fontSize: 9,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // ─── Current Streak ─────────────────────
              HCCard(
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Current streak',
                            style: theme.textTheme.titleMedium),
                        Row(
                          children: [
                            Icon(Icons.local_fire_department_rounded,
                                color: theme.colorScheme.primary, size: 20),
                            const SizedBox(width: 4),
                            Text(
                              '4 days',
                              style: theme.textTheme.titleMedium?.copyWith(
                                color: theme.colorScheme.primary,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    HCStreakRow(
                      statuses: streakData,
                      dayLabels: const ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
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
