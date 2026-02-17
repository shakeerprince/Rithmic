import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:timeago/timeago.dart' as timeago;

import '../../../../core/widgets/hc_vote_button.dart';
import '../../domain/providers/community_providers.dart';

class PostDetailScreen extends ConsumerStatefulWidget {
  final String postId;
  const PostDetailScreen({super.key, required this.postId});

  @override
  ConsumerState<PostDetailScreen> createState() => _PostDetailScreenState();
}

class _PostDetailScreenState extends ConsumerState<PostDetailScreen> {
  final _commentController = TextEditingController();

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final posts = ref.watch(postsProvider);
    final post = posts.firstWhere((p) => p.id == widget.postId);
    final comments = ref.watch(commentsProvider(widget.postId));
    const userId = 'u1';

    return Scaffold(
      appBar: AppBar(title: const Text('Post')),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Author row
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 18,
                        backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.2),
                        child: Text(
                          post.authorName.substring(0, 1).toUpperCase(),
                          style: TextStyle(
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(post.authorName, style: theme.textTheme.titleSmall),
                          Text(
                            timeago.format(post.createdAt),
                            style: theme.textTheme.labelSmall?.copyWith(
                              color: theme.textTheme.bodySmall?.color,
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      if (post.habitName != null)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.primary.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(post.habitName!,
                              style: theme.textTheme.labelSmall?.copyWith(
                                color: theme.colorScheme.primary,
                              )),
                        ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Title
                  Text(post.title,
                      style: theme.textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.w800,
                      )),

                  const SizedBox(height: 12),

                  // Body
                  Text(post.body, style: theme.textTheme.bodyLarge),

                  const SizedBox(height: 16),

                  // Vote bar
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
                      Text('${comments.length}',
                          style: theme.textTheme.labelMedium),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.share_outlined, size: 20),
                        onPressed: () {},
                      ),
                    ],
                  ),

                  const Divider(height: 32),

                  // Comments header
                  Text('Comments',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                      )),
                  const SizedBox(height: 12),

                  // Comments list
                  ...comments.map((comment) => _CommentTile(comment: comment)),

                  if (comments.isEmpty)
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          children: [
                            Icon(Icons.chat_bubble_outline_rounded,
                                size: 48,
                                color: theme.colorScheme.primary.withValues(alpha: 0.3)),
                            const SizedBox(height: 12),
                            Text('No comments yet',
                                style: theme.textTheme.bodyMedium?.copyWith(
                                  color: theme.textTheme.bodySmall?.color,
                                )),
                            Text('Be the first to comment!',
                                style: theme.textTheme.bodySmall),
                          ],
                        ),
                      ),
                    ),

                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),

          // Comment input
          Container(
            padding: const EdgeInsets.fromLTRB(16, 8, 8, 8),
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              border: Border(
                top: BorderSide(
                  color: theme.colorScheme.outline.withValues(alpha: 0.2),
                ),
              ),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _commentController,
                      decoration: InputDecoration(
                        hintText: 'Add a comment...',
                        filled: true,
                        fillColor: theme.scaffoldBackgroundColor,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 10),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    onPressed: () {
                      if (_commentController.text.isNotEmpty) {
                        _commentController.clear();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Comment posted!')),
                        );
                      }
                    },
                    icon: Icon(
                      Icons.send_rounded,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CommentTile extends StatelessWidget {
  final dynamic comment;
  const _CommentTile({required this.comment});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isReply = comment.parentCommentId != null;

    return Padding(
      padding: EdgeInsets.only(left: isReply ? 32 : 0, bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 14,
            backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.15),
            child: Text(
              comment.authorName.substring(0, 1),
              style: TextStyle(
                color: theme.colorScheme.primary,
                fontSize: 12,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(comment.authorName,
                        style: theme.textTheme.labelMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        )),
                    const SizedBox(width: 8),
                    Text(timeago.format(comment.createdAt),
                        style: theme.textTheme.labelSmall?.copyWith(
                          color: theme.textTheme.bodySmall?.color,
                        )),
                  ],
                ),
                const SizedBox(height: 4),
                Text(comment.body, style: theme.textTheme.bodyMedium),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.arrow_upward_rounded,
                        size: 14, color: theme.textTheme.bodySmall?.color),
                    const SizedBox(width: 2),
                    Text('${comment.upvotes}',
                        style: theme.textTheme.labelSmall?.copyWith(
                          color: theme.textTheme.bodySmall?.color,
                        )),
                    const SizedBox(width: 16),
                    Text('Reply',
                        style: theme.textTheme.labelSmall?.copyWith(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.w600,
                        )),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
