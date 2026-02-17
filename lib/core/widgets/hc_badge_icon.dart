import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Badge display widget with tier-based glow
class HCBadgeIcon extends StatelessWidget {
  final String name;
  final String tier; // bronze, silver, gold, diamond
  final double size;
  final bool earned;
  final IconData? icon;

  const HCBadgeIcon({
    super.key,
    required this.name,
    required this.tier,
    this.size = 60,
    this.earned = true,
    this.icon,
  });

  Color get tierColor {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return AppColors.badgeBronze;
      case 'silver':
        return AppColors.badgeSilver;
      case 'gold':
        return AppColors.badgeGold;
      case 'diamond':
        return AppColors.badgeDiamond;
      default:
        return AppColors.badgeBronze;
    }
  }

  IconData get badgeIcon {
    if (icon != null) return icon!;
    switch (tier.toLowerCase()) {
      case 'bronze':
        return Icons.local_fire_department_rounded;
      case 'silver':
        return Icons.bolt_rounded;
      case 'gold':
        return Icons.star_rounded;
      case 'diamond':
        return Icons.diamond_rounded;
      default:
        return Icons.emoji_events_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: earned
                ? tierColor.withValues(alpha: 0.15)
                : theme.colorScheme.outline.withValues(alpha: 0.1),
            border: Border.all(
              color: earned
                  ? tierColor
                  : theme.colorScheme.outline.withValues(alpha: 0.3),
              width: 2,
            ),
            boxShadow: earned
                ? [
                    BoxShadow(
                      color: tierColor.withValues(alpha: 0.3),
                      blurRadius: 12,
                      spreadRadius: 2,
                    ),
                  ]
                : null,
          ),
          child: Icon(
            badgeIcon,
            size: size * 0.45,
            color: earned
                ? tierColor
                : theme.colorScheme.outline.withValues(alpha: 0.4),
          ),
        ),
        const SizedBox(height: 6),
        SizedBox(
          width: size + 16,
          child: Text(
            name,
            style: theme.textTheme.labelSmall?.copyWith(
              color: earned ? null : theme.colorScheme.outline.withValues(alpha: 0.5),
              fontSize: 9,
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
