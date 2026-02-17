import 'package:flutter/material.dart';

enum HCButtonStyle { primary, secondary, ghost }

/// Styled button with primary/secondary/ghost variants & loading state
class HCButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final HCButtonStyle style;
  final IconData? icon;
  final bool isLoading;
  final bool fullWidth;
  final double? height;

  const HCButton({
    super.key,
    required this.label,
    this.onPressed,
    this.style = HCButtonStyle.primary,
    this.icon,
    this.isLoading = false,
    this.fullWidth = false,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    Widget buttonChild = isLoading
        ? SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: style == HCButtonStyle.primary
                  ? theme.colorScheme.onPrimary
                  : theme.colorScheme.primary,
            ),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[
                Icon(icon, size: 18),
                const SizedBox(width: 8),
              ],
              Text(label),
            ],
          );

    Widget button;
    switch (style) {
      case HCButtonStyle.primary:
        button = ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            minimumSize: Size(fullWidth ? double.infinity : 0, height ?? 48),
          ),
          child: buttonChild,
        );
        break;
      case HCButtonStyle.secondary:
        button = OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: OutlinedButton.styleFrom(
            minimumSize: Size(fullWidth ? double.infinity : 0, height ?? 48),
          ),
          child: buttonChild,
        );
        break;
      case HCButtonStyle.ghost:
        button = TextButton(
          onPressed: isLoading ? null : onPressed,
          style: TextButton.styleFrom(
            minimumSize: Size(fullWidth ? double.infinity : 0, height ?? 48),
          ),
          child: buttonChild,
        );
        break;
    }

    return button;
  }
}
