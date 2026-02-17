import 'package:flutter/material.dart';

/// HabitCircle Design System — Color Palette
/// Supports Dark Neon (productivity) and Lifestyle (social) themes
class AppColors {
  AppColors._();

  // ─── Dark Neon Theme ───────────────────────────────────────────
  static const Color neonPrimary = Color(0xFFC8E600);
  static const Color neonPrimaryDark = Color(0xFFA3BC00);
  static const Color neonPrimaryLight = Color(0xFFDAF240);
  static const Color neonSurface = Color(0xFF0D0D1A);
  static const Color neonBackground = Color(0xFF111122);
  static const Color neonCard = Color(0xFF1A1A2E);
  static const Color neonCardLight = Color(0xFF16213E);
  static const Color neonBorder = Color(0xFF2A2A4A);
  static const Color neonTextPrimary = Color(0xFFFFFFFF);
  static const Color neonTextSecondary = Color(0xFFB0B0C0);
  static const Color neonTextTertiary = Color(0xFF707080);
  static const Color neonSuccess = Color(0xFF4ADE80);
  static const Color neonError = Color(0xFFFF6B6B);
  static const Color neonWarning = Color(0xFFFFD93D);
  static const Color neonInfo = Color(0xFF6CB4EE);

  // Active habit (neon green glow)
  static const Color neonActiveHabit = Color(0xFF9ECC00);
  static const Color neonActiveGlow = Color(0x33C8E600);

  // ─── Lifestyle Theme ───────────────────────────────────────────
  static const Color lifePrimary = Color(0xFFFF8C42);
  static const Color lifePrimaryDark = Color(0xFFE07030);
  static const Color lifePrimaryLight = Color(0xFFFFAE70);
  static const Color lifeSurface = Color(0xFFFFF8F0);
  static const Color lifeBackground = Color(0xFFFFF5EC);
  static const Color lifeCard = Color(0xFFFFFFFF);
  static const Color lifeCardAccent = Color(0xFFFFE8D0);
  static const Color lifeBorder = Color(0xFFFFDCC0);
  static const Color lifeTextPrimary = Color(0xFF1A1A2E);
  static const Color lifeTextSecondary = Color(0xFF6B6B7B);
  static const Color lifeTextTertiary = Color(0xFF9B9BAB);
  static const Color lifeSuccess = Color(0xFF22C55E);
  static const Color lifeError = Color(0xFFEF4444);
  static const Color lifeWarning = Color(0xFFF59E0B);
  static const Color lifeInfo = Color(0xFF3B82F6);

  // ─── Shared / Category Colors ──────────────────────────────────
  static const Color categoryHealth = Color(0xFF4ADE80);
  static const Color categoryFitness = Color(0xFFFF6B6B);
  static const Color categoryStudy = Color(0xFF6CB4EE);
  static const Color categoryWork = Color(0xFFFFD93D);
  static const Color categoryMindfulness = Color(0xFFCB6CE6);
  static const Color categoryCustom = Color(0xFFFF8C42);

  // ─── Badge Tiers ───────────────────────────────────────────────
  static const Color badgeBronze = Color(0xFFCD7F32);
  static const Color badgeSilver = Color(0xFFC0C0C0);
  static const Color badgeGold = Color(0xFFFFD700);
  static const Color badgeDiamond = Color(0xFFB9F2FF);

  // ─── Vote Colors ───────────────────────────────────────────────
  static const Color upvote = Color(0xFFFF4500);
  static const Color downvote = Color(0xFF7193FF);
  static const Color voteNeutral = Color(0xFF808090);

  // ─── Gradient Presets ──────────────────────────────────────────
  static const LinearGradient neonGradient = LinearGradient(
    colors: [neonPrimary, Color(0xFF88CC00)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient lifestyleGradient = LinearGradient(
    colors: [lifePrimary, Color(0xFFFF6B9D)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient darkCardGradient = LinearGradient(
    colors: [neonCard, neonCardLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
