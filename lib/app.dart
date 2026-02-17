import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'features/dashboard/domain/providers/dashboard_providers.dart';

class HabitCircleApp extends ConsumerWidget {
  const HabitCircleApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDarkMode = ref.watch(themeProvider);

    return MaterialApp.router(
      title: 'HabitCircle',
      debugShowCheckedModeBanner: false,
      theme: isDarkMode ? AppTheme.darkNeon : AppTheme.lifestyle,
      routerConfig: appRouter,
    );
  }
}
