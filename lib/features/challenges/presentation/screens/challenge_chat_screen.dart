import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../../data/models/challenge_model.dart';
import '../../domain/providers/challenge_providers.dart';

class ChallengeChatScreen extends ConsumerStatefulWidget {
  final String challengeId;
  const ChallengeChatScreen({super.key, required this.challengeId});

  @override
  ConsumerState<ChallengeChatScreen> createState() => _ChallengeChatScreenState();
}

class _ChallengeChatScreenState extends ConsumerState<ChallengeChatScreen> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final messages = ref.watch(challengeChatProvider(widget.challengeId));
    final challenges = ref.watch(challengesProvider);
    final challenge = challenges.firstWhere((c) => c.id == widget.challengeId);

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(challenge.title,
                style: theme.textTheme.titleSmall,
                overflow: TextOverflow.ellipsis),
            Text('${challenge.participantCount} members',
                style: theme.textTheme.labelSmall?.copyWith(
                  color: theme.textTheme.bodySmall?.color,
                )),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: messages.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.chat_bubble_outline_rounded,
                            size: 64,
                            color: theme.colorScheme.primary.withValues(alpha: 0.3)),
                        const SizedBox(height: 12),
                        Text('Start the conversation!',
                            style: theme.textTheme.bodyMedium),
                      ],
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      final msg = messages[index];
                      final isMe = msg.senderId == 'u1';

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Row(
                          mainAxisAlignment: isMe
                              ? MainAxisAlignment.end
                              : MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            if (!isMe) ...[
                              CircleAvatar(
                                radius: 14,
                                backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.15),
                                child: Text(
                                  msg.senderName.substring(0, 1),
                                  style: TextStyle(
                                    color: theme.colorScheme.primary,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 11,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                            ],
                            Flexible(
                              child: Container(
                                constraints: BoxConstraints(
                                  maxWidth: MediaQuery.of(context).size.width * 0.72,
                                ),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 14, vertical: 10),
                                decoration: BoxDecoration(
                                  color: isMe
                                      ? theme.colorScheme.primary
                                      : theme.cardTheme.color,
                                  borderRadius: BorderRadius.only(
                                    topLeft: const Radius.circular(16),
                                    topRight: const Radius.circular(16),
                                    bottomLeft: Radius.circular(isMe ? 16 : 4),
                                    bottomRight: Radius.circular(isMe ? 4 : 16),
                                  ),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    if (!isMe)
                                      Text(msg.senderName,
                                          style: theme.textTheme.labelSmall?.copyWith(
                                            color: theme.colorScheme.primary,
                                            fontWeight: FontWeight.w700,
                                          )),
                                    if (!isMe) const SizedBox(height: 2),
                                    Text(
                                      msg.message,
                                      style: theme.textTheme.bodyMedium?.copyWith(
                                        color: isMe
                                            ? theme.colorScheme.onPrimary
                                            : null,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Align(
                                      alignment: Alignment.bottomRight,
                                      child: Text(
                                        timeago.format(msg.sentAt, locale: 'en_short'),
                                        style: theme.textTheme.labelSmall?.copyWith(
                                          fontSize: 9,
                                          color: isMe
                                              ? theme.colorScheme.onPrimary.withValues(alpha: 0.7)
                                              : theme.textTheme.bodySmall?.color,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),

          // Message input
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
                      controller: _controller,
                      decoration: InputDecoration(
                        hintText: 'Message...',
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
                    onPressed: _sendMessage,
                    icon: Icon(Icons.send_rounded,
                        color: theme.colorScheme.primary),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _sendMessage() {
    if (_controller.text.trim().isEmpty) return;

    final msg = ChatMessageModel(
      id: const Uuid().v4(),
      challengeId: widget.challengeId,
      senderId: 'u1',
      senderName: 'You',
      message: _controller.text.trim(),
      sentAt: DateTime.now(),
    );

    ref.read(challengeChatProvider(widget.challengeId).notifier).addMessage(msg);
    _controller.clear();

    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }
}
