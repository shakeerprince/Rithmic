import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/post_model.dart';
import '../../data/models/comment_model.dart';

/// Demo posts
final _demoPosts = [
  PostModel(
    id: 'p1',
    authorId: 'u2',
    authorName: 'Sarah Chen',
    title: 'Day 30 of my morning run streak! 🏃‍♀️',
    body: 'Just completed 30 consecutive days of waking up at 5:30 AM for a morning run. The first week was brutal, but now my body naturally wakes up before my alarm. Tips that helped:\n\n1. Sleep by 10 PM\n2. Lay out running clothes the night before\n3. No phone for the first 30 min\n\nAnyone else doing morning runs? Let\'s share strategies!',
    habitName: 'Morning Run',
    upvotes: 305,
    downvotes: 12,
    commentCount: 69,
    createdAt: DateTime.now().subtract(const Duration(hours: 5)),
    upvotedBy: ['u3', 'u4'],
  ),
  PostModel(
    id: 'p2',
    authorId: 'u3',
    authorName: 'Mike Johnson',
    title: 'Meditation changed my anxiety levels dramatically',
    body: 'I\'ve been meditating for 15 minutes every morning for the past 60 days. My anxiety levels have dropped significantly. I use the box breathing technique: 4 seconds in, 4 seconds hold, 4 seconds out, 4 seconds hold.\n\nHere\'s what I noticed:\n- Better focus at work\n- Less reactive to stress\n- Improved sleep quality\n\nHighly recommend for anyone struggling with anxiety.',
    habitName: 'Meditation',
    upvotes: 189,
    downvotes: 5,
    commentCount: 42,
    createdAt: DateTime.now().subtract(const Duration(hours: 12)),
  ),
  PostModel(
    id: 'p3',
    authorId: 'u4',
    authorName: 'Alex Rivera',
    title: 'Failed my reading streak after 45 days. Starting over.',
    body: 'Life happened and I missed two days. Instead of being discouraged, I\'m starting fresh today. The 45 days taught me so much. I read 12 books in that time!\n\nRemember: a broken streak doesn\'t erase your progress. 💪',
    habitName: 'Reading',
    upvotes: 542,
    downvotes: 3,
    commentCount: 87,
    createdAt: DateTime.now().subtract(const Duration(days: 1)),
  ),
];

/// Provider: community posts
final postsProvider = StateNotifierProvider<PostsNotifier, List<PostModel>>(
  (ref) => PostsNotifier(),
);

/// Provider: selected filter
final postFilterProvider = StateProvider<String>((ref) => 'Hot');

/// Provider: comments for a post
final commentsProvider = StateNotifierProvider.family<CommentsNotifier, List<CommentModel>, String>(
  (ref, postId) => CommentsNotifier(postId),
);

class PostsNotifier extends StateNotifier<List<PostModel>> {
  PostsNotifier() : super(_demoPosts);

  void addPost(PostModel post) {
    state = [post, ...state];
  }

  void vote(String postId, String userId, int direction) {
    state = state.map((post) {
      if (post.id != postId) return post;

      final newUpvotedBy = List<String>.from(post.upvotedBy);
      final newDownvotedBy = List<String>.from(post.downvotedBy);

      // Remove existing vote
      newUpvotedBy.remove(userId);
      newDownvotedBy.remove(userId);

      // Apply new vote
      if (direction == 1) newUpvotedBy.add(userId);
      if (direction == -1) newDownvotedBy.add(userId);

      return post.copyWith(
        upvotes: post.upvotes + (direction == 1 ? 1 : 0) - (post.upvotedBy.contains(userId) ? 1 : 0),
        downvotes: post.downvotes + (direction == -1 ? 1 : 0) - (post.downvotedBy.contains(userId) ? 1 : 0),
        upvotedBy: newUpvotedBy,
        downvotedBy: newDownvotedBy,
      );
    }).toList();
  }
}

class CommentsNotifier extends StateNotifier<List<CommentModel>> {
  final String postId;

  CommentsNotifier(this.postId) : super(_demoComments(postId));

  void addComment(CommentModel comment) {
    state = [...state, comment];
  }
}

List<CommentModel> _demoComments(String postId) {
  if (postId == 'p1') {
    return [
      CommentModel(
        id: 'c1',
        postId: 'p1',
        authorId: 'u5',
        authorName: 'Jordan Lee',
        body: 'This is awesome! I\'m on day 15. The hardest part is definitely the first 10 minutes after waking up. Any tips for that?',
        upvotes: 45,
        createdAt: DateTime.now().subtract(const Duration(hours: 4)),
      ),
      CommentModel(
        id: 'c2',
        postId: 'p1',
        authorId: 'u6',
        authorName: 'Emma Wilson',
        body: 'I splash cold water on my face immediately. Works every time. Congrats on 30 days! 🎉',
        upvotes: 23,
        parentCommentId: 'c1',
        createdAt: DateTime.now().subtract(const Duration(hours: 3)),
      ),
      CommentModel(
        id: 'c3',
        postId: 'p1',
        authorId: 'u2',
        authorName: 'Sarah Chen',
        body: 'Thanks everyone! @Jordan, what Emma said + I also put my alarm across the room so I HAVE to get up.',
        upvotes: 31,
        parentCommentId: 'c1',
        createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      ),
    ];
  }
  return [];
}
