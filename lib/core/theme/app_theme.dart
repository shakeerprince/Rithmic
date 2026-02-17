import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_typography.dart';

/// HabitCircle Theming — Dark Neon & Lifestyle
class AppTheme {
  AppTheme._();

  // ─── Dark Neon Theme ──────────────────────────────────────────
  static ThemeData get darkNeon {
    final textTheme = AppTypography.textTheme.apply(
      bodyColor: AppColors.neonTextPrimary,
      displayColor: AppColors.neonTextPrimary,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.neonBackground,
      textTheme: textTheme,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.neonPrimary,
        onPrimary: AppColors.neonSurface,
        primaryContainer: AppColors.neonPrimaryDark,
        secondary: AppColors.neonPrimaryLight,
        onSecondary: AppColors.neonSurface,
        surface: AppColors.neonSurface,
        onSurface: AppColors.neonTextPrimary,
        error: AppColors.neonError,
        onError: Colors.white,
        outline: AppColors.neonBorder,
      ),
      cardTheme: CardThemeData(
        color: AppColors.neonCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.neonBorder, width: 0.5),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 0, vertical: 6),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.neonBackground,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        titleTextStyle: textTheme.titleLarge?.copyWith(
          color: AppColors.neonTextPrimary,
        ),
        iconTheme: const IconThemeData(color: AppColors.neonTextPrimary),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.neonSurface,
        selectedItemColor: AppColors.neonPrimary,
        unselectedItemColor: AppColors.neonTextTertiary,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.neonCard,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.neonBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.neonBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.neonPrimary, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        hintStyle: TextStyle(color: AppColors.neonTextTertiary),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.neonPrimary,
          foregroundColor: AppColors.neonSurface,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: textTheme.labelLarge?.copyWith(
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.neonPrimary,
          side: const BorderSide(color: AppColors.neonPrimary),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.neonCard,
        selectedColor: AppColors.neonPrimary,
        labelStyle: textTheme.labelMedium!,
        side: const BorderSide(color: AppColors.neonBorder),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.neonPrimary,
        foregroundColor: AppColors.neonSurface,
        elevation: 4,
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.neonBorder,
        thickness: 0.5,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.neonCard,
        contentTextStyle: textTheme.bodyMedium,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  // ─── Lifestyle Theme ──────────────────────────────────────────
  static ThemeData get lifestyle {
    final textTheme = AppTypography.textTheme.apply(
      bodyColor: AppColors.lifeTextPrimary,
      displayColor: AppColors.lifeTextPrimary,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.lifeBackground,
      textTheme: textTheme,
      colorScheme: const ColorScheme.light(
        primary: AppColors.lifePrimary,
        onPrimary: Colors.white,
        primaryContainer: AppColors.lifeCardAccent,
        secondary: AppColors.lifePrimaryLight,
        onSecondary: Colors.white,
        surface: AppColors.lifeSurface,
        onSurface: AppColors.lifeTextPrimary,
        error: AppColors.lifeError,
        onError: Colors.white,
        outline: AppColors.lifeBorder,
      ),
      cardTheme: CardThemeData(
        color: AppColors.lifeCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.lifeBorder, width: 0.5),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 0, vertical: 6),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.lifeBackground,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        titleTextStyle: textTheme.titleLarge?.copyWith(
          color: AppColors.lifeTextPrimary,
        ),
        iconTheme: const IconThemeData(color: AppColors.lifeTextPrimary),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.lifeCard,
        selectedItemColor: AppColors.lifePrimary,
        unselectedItemColor: AppColors.lifeTextTertiary,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.lifeCard,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.lifeBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.lifeBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.lifePrimary, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        hintStyle: TextStyle(color: AppColors.lifeTextTertiary),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.lifePrimary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: textTheme.labelLarge?.copyWith(
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.lifePrimary,
          side: const BorderSide(color: AppColors.lifePrimary),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.lifeCard,
        selectedColor: AppColors.lifePrimary,
        labelStyle: textTheme.labelMedium!,
        side: const BorderSide(color: AppColors.lifeBorder),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.lifePrimary,
        foregroundColor: Colors.white,
        elevation: 4,
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.lifeBorder,
        thickness: 0.5,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.lifeCard,
        contentTextStyle: textTheme.bodyMedium,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
