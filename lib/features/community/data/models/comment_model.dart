/// Threaded comment model for community posts
class CommentModel {
  final String id;
  final String postId;
  final String? parentCommentId;
  final String authorId;
  final String authorName;
  final String? authorAvatarUrl;
  final String body;
  int upvotes;
  int downvotes;
  final DateTime createdAt;
  final List<CommentModel> replies;

  CommentModel({
    required this.id,
    required this.postId,
    this.parentCommentId,
    required this.authorId,
    required this.authorName,
    this.authorAvatarUrl,
    required this.body,
    this.upvotes = 0,
    this.downvotes = 0,
    required this.createdAt,
    this.replies = const [],
  });

  int get score => upvotes - downvotes;

  Map<String, dynamic> toJson() => {
    'id': id,
    'postId': postId,
    'parentCommentId': parentCommentId,
    'authorId': authorId,
    'authorName': authorName,
    'authorAvatarUrl': authorAvatarUrl,
    'body': body,
    'upvotes': upvotes,
    'downvotes': downvotes,
    'createdAt': createdAt.toIso8601String(),
  };

  factory CommentModel.fromJson(Map<String, dynamic> json) => CommentModel(
    id: json['id'] as String,
    postId: json['postId'] as String,
    parentCommentId: json['parentCommentId'] as String?,
    authorId: json['authorId'] as String,
    authorName: json['authorName'] as String,
    authorAvatarUrl: json['authorAvatarUrl'] as String?,
    body: json['body'] as String,
    upvotes: json['upvotes'] as int? ?? 0,
    downvotes: json['downvotes'] as int? ?? 0,
    createdAt: DateTime.parse(json['createdAt'] as String),
  );
}
