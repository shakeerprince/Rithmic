/// Challenge model for group competitions
class ChallengeModel {
  final String id;
  final String title;
  final String description;
  final String creatorId;
  final String creatorName;
  final DateTime startDate;
  final DateTime endDate;
  final List<String> participantIds;
  final String habitCategory;
  final Map<String, int> leaderboard; // userId → score
  final String? imageUrl;
  final int maxParticipants;

  ChallengeModel({
    required this.id,
    required this.title,
    required this.description,
    required this.creatorId,
    required this.creatorName,
    required this.startDate,
    required this.endDate,
    this.participantIds = const [],
    this.habitCategory = 'Fitness',
    this.leaderboard = const {},
    this.imageUrl,
    this.maxParticipants = 50,
  });

  bool get isActive {
    final now = DateTime.now();
    return now.isAfter(startDate) && now.isBefore(endDate);
  }

  int get daysRemaining => endDate.difference(DateTime.now()).inDays;
  int get participantCount => participantIds.length;

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'description': description,
    'creatorId': creatorId,
    'creatorName': creatorName,
    'startDate': startDate.toIso8601String(),
    'endDate': endDate.toIso8601String(),
    'participantIds': participantIds,
    'habitCategory': habitCategory,
    'leaderboard': leaderboard,
    'imageUrl': imageUrl,
    'maxParticipants': maxParticipants,
  };

  factory ChallengeModel.fromJson(Map<String, dynamic> json) => ChallengeModel(
    id: json['id'] as String,
    title: json['title'] as String,
    description: json['description'] as String,
    creatorId: json['creatorId'] as String,
    creatorName: json['creatorName'] as String? ?? 'Unknown',
    startDate: DateTime.parse(json['startDate'] as String),
    endDate: DateTime.parse(json['endDate'] as String),
    participantIds: (json['participantIds'] as List?)?.cast<String>() ?? [],
    habitCategory: json['habitCategory'] as String? ?? 'Fitness',
    leaderboard: (json['leaderboard'] as Map?)?.cast<String, int>() ?? {},
    imageUrl: json['imageUrl'] as String?,
    maxParticipants: json['maxParticipants'] as int? ?? 50,
  );
}

/// Chat message within a challenge
class ChatMessageModel {
  final String id;
  final String challengeId;
  final String senderId;
  final String senderName;
  final String? senderAvatarUrl;
  final String message;
  final DateTime sentAt;

  ChatMessageModel({
    required this.id,
    required this.challengeId,
    required this.senderId,
    required this.senderName,
    this.senderAvatarUrl,
    required this.message,
    required this.sentAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'challengeId': challengeId,
    'senderId': senderId,
    'senderName': senderName,
    'senderAvatarUrl': senderAvatarUrl,
    'message': message,
    'sentAt': sentAt.toIso8601String(),
  };

  factory ChatMessageModel.fromJson(Map<String, dynamic> json) => ChatMessageModel(
    id: json['id'] as String,
    challengeId: json['challengeId'] as String,
    senderId: json['senderId'] as String,
    senderName: json['senderName'] as String,
    senderAvatarUrl: json['senderAvatarUrl'] as String?,
    message: json['message'] as String,
    sentAt: DateTime.parse(json['sentAt'] as String),
  );
}
