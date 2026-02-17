import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Weekly streak visualization - row of dots showing completed/missed/pending
class HCStreakRow extends StatelessWidget {
  final List<String> statuses; // 'completed', 'missed', 'pending'
  final List<String> dayLabels;

  const HCStreakRow({
    super.key,
    required this.statuses,
    this.dayLabels = const ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(statuses.length, (i) {
        final status = statuses[i];
        final Color dotColor;
        final IconData? icon;

        switch (status) {
          case 'completed':
            dotColor = AppColors.neonPrimary;
            icon = null;
            break;
          case 'missed':
            dotColor = AppColors.neonError;
            icon = Icons.close_rounded;
            break;
          default:
            dotColor = theme.colorScheme.outline.withValues(alpha: 0.3);
            icon = null;
        }

        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: dotColor.withValues(alpha: status == 'pending' ? 0.2 : 1.0),
                shape: BoxShape.circle,
                boxShadow: status == 'completed'
                    ? [
                        BoxShadow(
                          color: dotColor.withValues(alpha: 0.4),
                          blurRadius: 8,
                          spreadRadius: 1,
                        ),
                      ]
                    : null,
              ),
              child: icon != null
                  ? Icon(icon, size: 16, color: Colors.white)
                  : status == 'completed'
                      ? const Icon(Icons.check_rounded,
                          size: 16, color: AppColors.neonSurface)
                      : null,
            ),
            const SizedBox(height: 4),
            Text(
              i < dayLabels.length ? dayLabels[i] : '',
              style: theme.textTheme.labelSmall?.copyWith(
                color: theme.textTheme.bodySmall?.color?.withValues(alpha: 0.5),
                fontSize: 10,
              ),
            ),
          ],
        );
      }),
    );
  }
}
