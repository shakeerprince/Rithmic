import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/challenge_model.dart';

/// Demo challenges
final _demoChallenges = [
  ChallengeModel(
    id: 'ch1',
    title: '30-Day Morning Run Challenge',
    description: 'Wake up and run every morning for 30 days. Minimum 2km per run. Track your progress and compete with others!',
    creatorId: 'u2',
    creatorName: 'Sarah Chen',
    startDate: DateTime.now().subtract(const Duration(days: 10)),
    endDate: DateTime.now().add(const Duration(days: 20)),
    participantIds: ['u1', 'u2', 'u3', 'u4', 'u5'],
    habitCategory: 'Fitness',
    leaderboard: {'u2': 10, 'u1': 8, 'u3': 7, 'u4': 6, 'u5': 4},
  ),
  ChallengeModel(
    id: 'ch2',
    title: 'No Sugar for 21 Days',
    description: 'Cut out all added sugar from your diet for 21 days. Natural sugars from fruits are fine.',
    creatorId: 'u3',
    creatorName: 'Mike Johnson',
    startDate: DateTime.now().subtract(const Duration(days: 5)),
    endDate: DateTime.now().add(const Duration(days: 16)),
    participantIds: ['u1', 'u3', 'u6', 'u7'],
    habitCategory: 'Health',
    leaderboard: {'u3': 5, 'u1': 5, 'u6': 4, 'u7': 3},
  ),
  ChallengeModel(
    id: 'ch3',
    title: 'Read Every Day for 60 Days',
    description: 'Read at least 20 pages every day for 60 days. Share book recommendations in the chat!',
    creatorId: 'u4',
    creatorName: 'Alex Rivera',
    startDate: DateTime.now().add(const Duration(days: 3)),
    endDate: DateTime.now().add(const Duration(days: 63)),
    participantIds: ['u1', 'u4'],
    habitCategory: 'Study',
    leaderboard: {},
    maxParticipants: 30,
  ),
];

/// Provider: all challenges
final challengesProvider = StateNotifierProvider<ChallengesNotifier, List<ChallengeModel>>(
  (ref) => ChallengesNotifier(),
);

/// Provider: chat messages for a challenge
final challengeChatProvider = StateNotifierProvider.family<ChatNotifier, List<ChatMessageModel>, String>(
  (ref, challengeId) => ChatNotifier(challengeId),
);

class ChallengesNotifier extends StateNotifier<List<ChallengeModel>> {
  ChallengesNotifier() : super(_demoChallenges);

  void addChallenge(ChallengeModel challenge) {
    state = [challenge, ...state];
  }

  void joinChallenge(String challengeId, String userId) {
    state = state.map((c) {
      if (c.id != challengeId) return c;
      final newParticipants = List<String>.from(c.participantIds)..add(userId);
      return ChallengeModel(
        id: c.id,
        title: c.title,
        description: c.description,
        creatorId: c.creatorId,
        creatorName: c.creatorName,
        startDate: c.startDate,
        endDate: c.endDate,
        participantIds: newParticipants,
        habitCategory: c.habitCategory,
        leaderboard: c.leaderboard,
        imageUrl: c.imageUrl,
        maxParticipants: c.maxParticipants,
      );
    }).toList();
  }
}

class ChatNotifier extends StateNotifier<List<ChatMessageModel>> {
  final String challengeId;

  ChatNotifier(this.challengeId) : super(_demoChatMessages(challengeId));

  void addMessage(ChatMessageModel message) {
    state = [...state, message];
  }
}

List<ChatMessageModel> _demoChatMessages(String challengeId) {
  if (challengeId == 'ch1') {
    return [
      ChatMessageModel(
        id: 'm1', challengeId: 'ch1', senderId: 'u2', senderName: 'Sarah Chen',
        message: 'Day 10 done! 💪 Who else is still going strong?',
        sentAt: DateTime.now().subtract(const Duration(hours: 6)),
      ),
      ChatMessageModel(
        id: 'm2', challengeId: 'ch1', senderId: 'u3', senderName: 'Mike Johnson',
        message: 'Present! Had to force myself out of bed today though 😅',
        sentAt: DateTime.now().subtract(const Duration(hours: 5)),
      ),
      ChatMessageModel(
        id: 'm3', challengeId: 'ch1', senderId: 'u1', senderName: 'You',
        message: 'Still here! The cold mornings are tough but worth it.',
        sentAt: DateTime.now().subtract(const Duration(hours: 3)),
      ),
    ];
  }
  return [];
}
