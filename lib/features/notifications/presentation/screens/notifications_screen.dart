import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:timeago/timeago.dart' as timeago;

import '../../domain/providers/notification_providers.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final notifications = ref.watch(notificationsProvider);
    final unread = ref.watch(unreadCountProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          if (unread > 0)
            TextButton(
              onPressed: () {
                ref.read(notificationsProvider.notifier).markAllAsRead();
              },
              child: Text('Mark all read',
                  style: TextStyle(
                    color: theme.colorScheme.primary,
                    fontSize: 12,
                  )),
            ),
        ],
      ),
      body: notifications.isEmpty
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.notifications_off_outlined,
                      size: 64,
                      color: theme.colorScheme.primary.withValues(alpha: 0.3)),
                  const SizedBox(height: 12),
                  Text('No notifications yet',
                      style: theme.textTheme.bodyMedium),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final notif = notifications[index];
                return _NotificationTile(notif: notif);
              },
            ),
    );
  }
}

class _NotificationTile extends ConsumerWidget {
  final dynamic notif;
  const _NotificationTile({required this.notif});

  IconData _iconForType(String type) {
    switch (type) {
      case 'upvote': return Icons.arrow_upward_rounded;
      case 'post_reply': return Icons.chat_bubble_outline_rounded;
      case 'challenge_invite': return Icons.emoji_events_rounded;
      case 'streak_milestone': return Icons.local_fire_department_rounded;
      case 'chat_message': return Icons.forum_rounded;
      case 'reminder': return Icons.alarm_rounded;
      default: return Icons.notifications_rounded;
    }
  }

  Color _colorForType(String type, ThemeData theme) {
    switch (type) {
      case 'upvote': return Colors.orange;
      case 'post_reply': return Colors.blue;
      case 'challenge_invite': return Colors.amber;
      case 'streak_milestone': return Colors.red;
      case 'chat_message': return Colors.green;
      default: return theme.colorScheme.primary;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final color = _colorForType(notif.type, theme);

    return GestureDetector(
      onTap: () {
        ref.read(notificationsProvider.notifier).markAsRead(notif.id);
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: notif.isRead
              ? theme.cardTheme.color
              : theme.colorScheme.primary.withValues(alpha: 0.06),
          borderRadius: BorderRadius.circular(14),
          border: !notif.isRead
              ? Border.all(
                  color: theme.colorScheme.primary.withValues(alpha: 0.2),
                  width: 1,
                )
              : Border.all(
                  color: theme.colorScheme.outline.withValues(alpha: 0.15),
                  width: 0.5,
                ),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: color.withValues(alpha: 0.15),
              ),
              child: Icon(_iconForType(notif.type), size: 18, color: color),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(notif.title,
                      style: theme.textTheme.titleSmall?.copyWith(
                        fontWeight: notif.isRead ? FontWeight.w500 : FontWeight.w700,
                      )),
                  const SizedBox(height: 2),
                  Text(notif.body,
                      style: theme.textTheme.bodySmall,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 4),
                  Text(
                    timeago.format(notif.createdAt),
                    style: theme.textTheme.labelSmall?.copyWith(
                      color: theme.textTheme.bodySmall?.color,
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
            ),
            if (!notif.isRead)
              Container(
                width: 8,
                height: 8,
                margin: const EdgeInsets.only(top: 6),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: theme.colorScheme.primary,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
