import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/notification_model.dart';

/// Demo notifications
final _demoNotifications = [
  NotificationModel(
    id: 'n1', userId: 'u1', type: 'upvote',
    title: 'Your post got 100 upvotes!',
    body: 'Your post "Morning Run streak" is trending',
    senderName: 'Community', targetId: 'p1', targetType: 'post',
    createdAt: DateTime.now().subtract(const Duration(minutes: 30)),
  ),
  NotificationModel(
    id: 'n2', userId: 'u1', type: 'post_reply',
    title: 'Sarah Chen replied',
    body: 'Great tips! I\'ve been doing the same...',
    senderName: 'Sarah Chen', targetId: 'p1', targetType: 'post',
    createdAt: DateTime.now().subtract(const Duration(hours: 2)),
  ),
  NotificationModel(
    id: 'n3', userId: 'u1', type: 'challenge_invite',
    title: 'Challenge Invite',
    body: 'Alex invited you to "Read Every Day for 60 Days"',
    senderName: 'Alex Rivera', targetId: 'ch3', targetType: 'challenge',
    createdAt: DateTime.now().subtract(const Duration(hours: 5)),
  ),
  NotificationModel(
    id: 'n4', userId: 'u1', type: 'streak_milestone',
    title: '🔥 7-Day Streak!',
    body: 'You\'ve completed 7 consecutive days of "Read 30 Pages". Badge earned!',
    targetId: '2', targetType: 'habit',
    createdAt: DateTime.now().subtract(const Duration(hours: 8)),
  ),
  NotificationModel(
    id: 'n5', userId: 'u1', type: 'chat_message',
    title: 'New message in "30-Day Morning Run"',
    body: 'Sarah: Day 10 done! 💪',
    senderName: 'Sarah Chen', targetId: 'ch1', targetType: 'challenge',
    createdAt: DateTime.now().subtract(const Duration(hours: 10)),
  ),
];

/// Provider: notifications
final notificationsProvider = StateNotifierProvider<NotificationsNotifier, List<NotificationModel>>(
  (ref) => NotificationsNotifier(),
);

/// Provider: unread count
final unreadCountProvider = Provider<int>((ref) {
  final notifications = ref.watch(notificationsProvider);
  return notifications.where((n) => !n.isRead).length;
});

class NotificationsNotifier extends StateNotifier<List<NotificationModel>> {
  NotificationsNotifier() : super(_demoNotifications);

  void markAsRead(String id) {
    state = state.map((n) {
      if (n.id == id) {
        n.isRead = true;
        return n;
      }
      return n;
    }).toList();
  }

  void markAllAsRead() {
    state = state.map((n) {
      n.isRead = true;
      return n;
    }).toList();
  }

  void addNotification(NotificationModel notification) {
    state = [notification, ...state];
  }
}
