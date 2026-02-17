import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/widgets/hc_card.dart';
import '../../../../core/widgets/hc_chip.dart';
import '../../domain/providers/challenge_providers.dart';

class ChallengesScreen extends ConsumerWidget {
  const ChallengesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final challenges = ref.watch(challengesProvider);
    final activeChallenges = challenges.where((c) => c.isActive).toList();
    final upcoming = challenges.where((c) => c.startDate.isAfter(DateTime.now())).toList();

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Text('Challenges', style: theme.textTheme.headlineSmall),
              ),
              const SizedBox(height: 20),

              // Active Challenges
              Text('🔥 Active Challenges',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  )),
              const SizedBox(height: 12),

              ...activeChallenges.map((challenge) => _ChallengeCard(
                challenge: challenge,
                isActive: true,
              )),

              if (activeChallenges.isEmpty)
                HCCard(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          Icon(Icons.emoji_events_outlined,
                              size: 48,
                              color: theme.colorScheme.primary.withValues(alpha: 0.3)),
                          const SizedBox(height: 8),
                          Text('No active challenges',
                              style: theme.textTheme.bodyMedium),
                        ],
                      ),
                    ),
                  ),
                ),

              const SizedBox(height: 24),

              // Upcoming
              if (upcoming.isNotEmpty) ...[
                Text('📅 Upcoming',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    )),
                const SizedBox(height: 12),
                ...upcoming.map((challenge) => _ChallengeCard(
                  challenge: challenge,
                  isActive: false,
                )),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _ChallengeCard extends StatelessWidget {
  final dynamic challenge;
  final bool isActive;

  const _ChallengeCard({required this.challenge, required this.isActive});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return HCCard(
      onTap: () => context.push('/challenge/${challenge.id}'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              HCChip(label: challenge.habitCategory, selected: true),
              const Spacer(),
              if (isActive)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.green.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '${challenge.daysRemaining}d left',
                    style: theme.textTheme.labelSmall?.copyWith(
                      color: Colors.green,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                )
              else
                Text(
                  'Starts in ${challenge.startDate.difference(DateTime.now()).inDays}d',
                  style: theme.textTheme.labelSmall?.copyWith(
                    color: theme.textTheme.bodySmall?.color,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 10),
          Text(challenge.title,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              )),
          const SizedBox(height: 4),
          Text(
            challenge.description,
            style: theme.textTheme.bodySmall,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Icon(Icons.people_rounded, size: 16,
                  color: theme.textTheme.bodySmall?.color),
              const SizedBox(width: 4),
              Text(
                '${challenge.participantCount}/${challenge.maxParticipants}',
                style: theme.textTheme.labelSmall,
              ),
              const Spacer(),
              Text('by ${challenge.creatorName}',
                  style: theme.textTheme.labelSmall?.copyWith(
                    color: theme.textTheme.bodySmall?.color,
                  )),
            ],
          ),
        ],
      ),
    );
  }
}
