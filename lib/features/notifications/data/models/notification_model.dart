/// Notification model for the notification center
class NotificationModel {
  final String id;
  final String userId;
  final String type; // post_reply, upvote, challenge_invite, chat_message, streak_milestone, reminder
  final String title;
  final String body;
  final String? targetId;
  final String? targetType; // post, challenge, habit
  final String? senderName;
  final String? senderAvatarUrl;
  bool isRead;
  final DateTime createdAt;

  NotificationModel({
    required this.id,
    required this.userId,
    required this.type,
    required this.title,
    required this.body,
    this.targetId,
    this.targetType,
    this.senderName,
    this.senderAvatarUrl,
    this.isRead = false,
    required this.createdAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'userId': userId,
    'type': type,
    'title': title,
    'body': body,
    'targetId': targetId,
    'targetType': targetType,
    'senderName': senderName,
    'senderAvatarUrl': senderAvatarUrl,
    'isRead': isRead,
    'createdAt': createdAt.toIso8601String(),
  };

  factory NotificationModel.fromJson(Map<String, dynamic> json) => NotificationModel(
    id: json['id'] as String,
    userId: json['userId'] as String,
    type: json['type'] as String,
    title: json['title'] as String,
    body: json['body'] as String,
    targetId: json['targetId'] as String?,
    targetType: json['targetType'] as String?,
    senderName: json['senderName'] as String?,
    senderAvatarUrl: json['senderAvatarUrl'] as String?,
    isRead: json['isRead'] as bool? ?? false,
    createdAt: DateTime.parse(json['createdAt'] as String),
  );
}
