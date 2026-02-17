import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/widgets/hc_card.dart';
import '../../../../core/widgets/hc_button.dart';
import '../../domain/providers/challenge_providers.dart';

class ChallengeDetailScreen extends ConsumerWidget {
  final String challengeId;
  const ChallengeDetailScreen({super.key, required this.challengeId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final challenges = ref.watch(challengesProvider);
    final challenge = challenges.firstWhere((c) => c.id == challengeId);
    final isJoined = challenge.participantIds.contains('u1');

    // Sort leaderboard
    final sorted = challenge.leaderboard.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    final names = {
      'u1': 'You', 'u2': 'Sarah Chen', 'u3': 'Mike Johnson',
      'u4': 'Alex Rivera', 'u5': 'Jordan Lee', 'u6': 'Emma Wilson',
      'u7': 'Chris Taylor',
    };

    return Scaffold(
      appBar: AppBar(
        title: Text(challenge.title),
        actions: [
          IconButton(
            icon: const Icon(Icons.chat_rounded),
            onPressed: () => context.push('/challenge/${challenge.id}/chat'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Info card
            HCCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          challenge.habitCategory,
                          style: theme.textTheme.labelSmall?.copyWith(
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      const Spacer(),
                      if (challenge.isActive)
                        Text('${challenge.daysRemaining} days left',
                            style: theme.textTheme.labelMedium?.copyWith(
                              color: Colors.green,
                              fontWeight: FontWeight.w700,
                            )),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(challenge.description, style: theme.textTheme.bodyMedium),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(Icons.people_rounded, size: 16,
                          color: theme.textTheme.bodySmall?.color),
                      const SizedBox(width: 6),
                      Text('${challenge.participantCount} participants',
                          style: theme.textTheme.labelMedium),
                      const Spacer(),
                      Text('Created by ${challenge.creatorName}',
                          style: theme.textTheme.labelSmall?.copyWith(
                            color: theme.textTheme.bodySmall?.color,
                          )),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Join button
            if (!isJoined)
              HCButton(
                label: 'Join Challenge',
                onPressed: () {
                  ref.read(challengesProvider.notifier).joinChallenge(challengeId, 'u1');
                },
                fullWidth: true,
              ),

            if (isJoined)
              HCButton(
                label: 'Open Group Chat 💬',
                onPressed: () => context.push('/challenge/${challenge.id}/chat'),
                fullWidth: true,
              ),

            const SizedBox(height: 24),

            // Leaderboard
            Text('🏆 Leaderboard',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                )),
            const SizedBox(height: 12),

            if (sorted.isEmpty)
              HCCard(
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Text('Challenge hasn\'t started yet',
                        style: theme.textTheme.bodyMedium),
                  ),
                ),
              ),

            ...sorted.asMap().entries.map((entry) {
              final rank = entry.key + 1;
              final userId = entry.value.key;
              final score = entry.value.value;
              final name = names[userId] ?? userId;
              final isYou = userId == 'u1';
              final medals = ['🥇', '🥈', '🥉'];

              return HCCard(
                color: isYou
                    ? theme.colorScheme.primary.withValues(alpha: 0.1)
                    : null,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Row(
                  children: [
                    SizedBox(
                      width: 32,
                      child: rank <= 3
                          ? Text(medals[rank - 1],
                              style: const TextStyle(fontSize: 20))
                          : Text('#$rank',
                              style: theme.textTheme.titleSmall?.copyWith(
                                color: theme.textTheme.bodySmall?.color,
                              )),
                    ),
                    CircleAvatar(
                      radius: 16,
                      backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.2),
                      child: Text(
                        name.substring(0, 1),
                        style: TextStyle(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.w700,
                          fontSize: 14,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        name,
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: isYou ? FontWeight.w700 : FontWeight.w500,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '$score days',
                        style: theme.textTheme.labelMedium?.copyWith(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
