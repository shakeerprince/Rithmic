/// Community post model — Reddit-style habit post
class PostModel {
  final String id;
  final String authorId;
  final String authorName;
  final String? authorAvatarUrl;
  final String title;
  final String body;
  final String? habitId;
  final String? habitName;
  final String? imageUrl;
  int upvotes;
  int downvotes;
  int commentCount;
  final DateTime createdAt;
  List<String> upvotedBy;
  List<String> downvotedBy;

  PostModel({
    required this.id,
    required this.authorId,
    required this.authorName,
    this.authorAvatarUrl,
    required this.title,
    required this.body,
    this.habitId,
    this.habitName,
    this.imageUrl,
    this.upvotes = 0,
    this.downvotes = 0,
    this.commentCount = 0,
    required this.createdAt,
    this.upvotedBy = const [],
    this.downvotedBy = const [],
  });

  int get score => upvotes - downvotes;

  int getUserVote(String userId) {
    if (upvotedBy.contains(userId)) return 1;
    if (downvotedBy.contains(userId)) return -1;
    return 0;
  }

  PostModel copyWith({
    String? title,
    String? body,
    int? upvotes,
    int? downvotes,
    int? commentCount,
    List<String>? upvotedBy,
    List<String>? downvotedBy,
  }) {
    return PostModel(
      id: id,
      authorId: authorId,
      authorName: authorName,
      authorAvatarUrl: authorAvatarUrl,
      title: title ?? this.title,
      body: body ?? this.body,
      habitId: habitId,
      habitName: habitName,
      imageUrl: imageUrl,
      upvotes: upvotes ?? this.upvotes,
      downvotes: downvotes ?? this.downvotes,
      commentCount: commentCount ?? this.commentCount,
      createdAt: createdAt,
      upvotedBy: upvotedBy ?? this.upvotedBy,
      downvotedBy: downvotedBy ?? this.downvotedBy,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'authorId': authorId,
    'authorName': authorName,
    'authorAvatarUrl': authorAvatarUrl,
    'title': title,
    'body': body,
    'habitId': habitId,
    'habitName': habitName,
    'imageUrl': imageUrl,
    'upvotes': upvotes,
    'downvotes': downvotes,
    'commentCount': commentCount,
    'createdAt': createdAt.toIso8601String(),
    'upvotedBy': upvotedBy,
    'downvotedBy': downvotedBy,
  };

  factory PostModel.fromJson(Map<String, dynamic> json) => PostModel(
    id: json['id'] as String,
    authorId: json['authorId'] as String,
    authorName: json['authorName'] as String,
    authorAvatarUrl: json['authorAvatarUrl'] as String?,
    title: json['title'] as String,
    body: json['body'] as String,
    habitId: json['habitId'] as String?,
    habitName: json['habitName'] as String?,
    imageUrl: json['imageUrl'] as String?,
    upvotes: json['upvotes'] as int? ?? 0,
    downvotes: json['downvotes'] as int? ?? 0,
    commentCount: json['commentCount'] as int? ?? 0,
    createdAt: DateTime.parse(json['createdAt'] as String),
    upvotedBy: (json['upvotedBy'] as List?)?.cast<String>() ?? [],
    downvotedBy: (json['downvotedBy'] as List?)?.cast<String>() ?? [],
  );
}
