import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../../../../core/widgets/hc_card.dart';
import '../../../../core/widgets/hc_chip.dart';
import '../../../../core/widgets/hc_vote_button.dart';
import '../../../../core/constants/app_constants.dart';
import '../../domain/providers/community_providers.dart';

class CommunityFeedScreen extends ConsumerWidget {
  const CommunityFeedScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final posts = ref.watch(postsProvider);
    final filter = ref.watch(postFilterProvider);

    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ─── Header ─────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Community', style: theme.textTheme.headlineSmall),
                  IconButton(
                    icon: const Icon(Icons.search_rounded),
                    onPressed: () {},
                  ),
                ],
              ),
            ),

            // ─── Filter Chips ─────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: Row(
                children: AppConstants.postFilters.map((f) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: HCChip(
                      label: f,
                      selected: filter == f,
                      icon: f == 'Hot'
                          ? Icons.local_fire_department_rounded
                          : f == 'New'
                              ? Icons.new_releases_rounded
                              : Icons.trending_up_rounded,
                      onTap: () {
                        ref.read(postFilterProvider.notifier).state = f;
                      },
                    ),
                  );
                }).toList(),
              ),
            ),

            const SizedBox(height: 8),

            // ─── Posts Feed ───────────────────────────
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: posts.length,
                itemBuilder: (context, index) {
                  final post = posts[index];
                  return _PostCard(post: post);
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/create-post'),
        icon: const Icon(Icons.edit_rounded, size: 20),
        label: const Text('Post'),
      ),
    );
  }
}

class _PostCard extends ConsumerWidget {
  final dynamic post;
  const _PostCard({required this.post});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    const userId = 'u1'; // current user

    return HCCard(
      onTap: () => context.push('/post/${post.id}'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Author row
          Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.2),
                child: Text(
                  post.authorName.substring(0, 1).toUpperCase(),
                  style: TextStyle(
                    color: theme.colorScheme.primary,
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(post.authorName,
                        style: theme.textTheme.labelMedium),
                    Text(
                      timeago.format(post.createdAt),
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: theme.textTheme.bodySmall?.color,
                      ),
                    ),
                  ],
                ),
              ),
              if (post.habitName != null)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    post.habitName!,
                    style: theme.textTheme.labelSmall?.copyWith(
                      color: theme.colorScheme.primary,
                      fontSize: 10,
                    ),
                  ),
                ),
            ],
          ),

          const SizedBox(height: 12),

          // Title
          Text(post.title,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              )),

          const SizedBox(height: 6),

          // Body preview
          Text(
            post.body,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.textTheme.bodySmall?.color,
            ),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),

          const SizedBox(height: 12),

          // Action row
          Row(
            children: [
              HCVoteButton(
                score: post.score,
                userVote: post.getUserVote(userId),
                onVote: (direction) {
                  ref.read(postsProvider.notifier).vote(post.id, userId, direction);
                },
              ),
              const SizedBox(width: 16),
              Icon(Icons.chat_bubble_outline_rounded,
                  size: 18, color: theme.textTheme.bodySmall?.color),
              const SizedBox(width: 4),
              Text('${post.commentCount}',
                  style: theme.textTheme.labelMedium?.copyWith(
                    color: theme.textTheme.bodySmall?.color,
                  )),
              const Spacer(),
              Icon(Icons.share_outlined,
                  size: 18, color: theme.textTheme.bodySmall?.color),
            ],
          ),
        ],
      ),
    );
  }
}
