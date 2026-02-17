import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Reddit-style upvote/downvote button pair
class HCVoteButton extends StatelessWidget {
  final int score;
  final int userVote; // 1 = upvoted, -1 = downvoted, 0 = none
  final ValueChanged<int> onVote;
  final bool compact;

  const HCVoteButton({
    super.key,
    required this.score,
    required this.userVote,
    required this.onVote,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (compact) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _VoteIcon(
            icon: Icons.arrow_upward_rounded,
            isActive: userVote == 1,
            activeColor: AppColors.upvote,
            onTap: () => onVote(userVote == 1 ? 0 : 1),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Text(
              _formatScore(score),
              style: theme.textTheme.labelMedium?.copyWith(
                color: userVote == 1
                    ? AppColors.upvote
                    : userVote == -1
                        ? AppColors.downvote
                        : null,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          _VoteIcon(
            icon: Icons.arrow_downward_rounded,
            isActive: userVote == -1,
            activeColor: AppColors.downvote,
            onTap: () => onVote(userVote == -1 ? 0 : -1),
          ),
        ],
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: theme.colorScheme.outline.withValues(alpha: 0.3),
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _VoteIcon(
            icon: Icons.arrow_upward_rounded,
            isActive: userVote == 1,
            activeColor: AppColors.upvote,
            onTap: () => onVote(userVote == 1 ? 0 : 1),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 6),
            child: Text(
              _formatScore(score),
              style: theme.textTheme.labelMedium?.copyWith(
                color: userVote == 1
                    ? AppColors.upvote
                    : userVote == -1
                        ? AppColors.downvote
                        : null,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          _VoteIcon(
            icon: Icons.arrow_downward_rounded,
            isActive: userVote == -1,
            activeColor: AppColors.downvote,
            onTap: () => onVote(userVote == -1 ? 0 : -1),
          ),
        ],
      ),
    );
  }

  String _formatScore(int score) {
    if (score.abs() >= 1000) {
      return '${(score / 1000).toStringAsFixed(1)}k';
    }
    return score.toString();
  }
}

class _VoteIcon extends StatelessWidget {
  final IconData icon;
  final bool isActive;
  final Color activeColor;
  final VoidCallback onTap;

  const _VoteIcon({
    required this.icon,
    required this.isActive,
    required this.activeColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(4),
        child: Icon(
          icon,
          size: 20,
          color: isActive ? activeColor : AppColors.voteNeutral,
        ),
      ),
    );
  }
}
