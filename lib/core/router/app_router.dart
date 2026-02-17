import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/habits/presentation/screens/tasks_screen.dart';
import '../../features/habits/presentation/screens/create_habit_screen.dart';
import '../../features/community/presentation/screens/community_feed_screen.dart';
import '../../features/community/presentation/screens/create_post_screen.dart';
import '../../features/community/presentation/screens/post_detail_screen.dart';
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../../features/challenges/presentation/screens/challenges_screen.dart';
import '../../features/challenges/presentation/screens/challenge_detail_screen.dart';
import '../../features/challenges/presentation/screens/challenge_chat_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../../features/notifications/presentation/screens/notifications_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/onboarding_screen.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

/// App router with bottom nav shell
final appRouter = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/onboarding',
  routes: [
    // Onboarding & Auth
    GoRoute(
      path: '/onboarding',
      builder: (context, state) => const OnboardingScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),

    // Shell route with bottom nav
    ShellRoute(
      navigatorKey: _shellNavigatorKey,
      builder: (context, state, child) => _AppShell(child: child),
      routes: [
        GoRoute(
          path: '/tasks',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: TasksScreen(),
          ),
        ),
        GoRoute(
          path: '/community',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: CommunityFeedScreen(),
          ),
        ),
        GoRoute(
          path: '/dashboard',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: DashboardScreen(),
          ),
        ),
        GoRoute(
          path: '/challenges',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: ChallengesScreen(),
          ),
        ),
        GoRoute(
          path: '/profile',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: ProfileScreen(),
          ),
        ),
      ],
    ),

    // Full screen routes (above bottom nav)
    GoRoute(
      path: '/create-habit',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (context, state) => const CreateHabitScreen(),
    ),
    GoRoute(
      path: '/create-post',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (context, state) => const CreatePostScreen(),
    ),
    GoRoute(
      path: '/post/:id',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (context, state) => PostDetailScreen(
        postId: state.pathParameters['id']!,
      ),
    ),
    GoRoute(
      path: '/challenge/:id',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (context, state) => ChallengeDetailScreen(
        challengeId: state.pathParameters['id']!,
      ),
    ),
    GoRoute(
      path: '/challenge/:id/chat',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (context, state) => ChallengeChatScreen(
        challengeId: state.pathParameters['id']!,
      ),
    ),
    GoRoute(
      path: '/notifications',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (context, state) => const NotificationsScreen(),
    ),
  ],
);

/// App shell with custom bottom navigation
class _AppShell extends StatelessWidget {
  final Widget child;
  const _AppShell({required this.child});

  int _currentIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    if (location.startsWith('/tasks')) return 0;
    if (location.startsWith('/community')) return 1;
    if (location.startsWith('/dashboard')) return 2;
    if (location.startsWith('/challenges')) return 3;
    if (location.startsWith('/profile')) return 4;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currentIndex = _currentIndex(context);

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: theme.bottomNavigationBarTheme.backgroundColor,
          border: Border(
            top: BorderSide(
              color: theme.colorScheme.outline.withValues(alpha: 0.2),
              width: 0.5,
            ),
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _NavItem(
                  icon: Icons.task_alt_rounded,
                  label: 'Tasks',
                  isActive: currentIndex == 0,
                  onTap: () => context.go('/tasks'),
                ),
                _NavItem(
                  icon: Icons.forum_rounded,
                  label: 'Community',
                  isActive: currentIndex == 1,
                  onTap: () => context.go('/community'),
                ),
                _NavItem(
                  icon: Icons.dashboard_rounded,
                  label: 'Dashboard',
                  isActive: currentIndex == 2,
                  onTap: () => context.go('/dashboard'),
                ),
                _NavItem(
                  icon: Icons.emoji_events_rounded,
                  label: 'Challenges',
                  isActive: currentIndex == 3,
                  onTap: () => context.go('/challenges'),
                ),
                _NavItem(
                  icon: Icons.person_rounded,
                  label: 'Profile',
                  isActive: currentIndex == 4,
                  onTap: () => context.go('/profile'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final activeColor = theme.colorScheme.primary;
    final inactiveColor = theme.bottomNavigationBarTheme.unselectedItemColor ??
        theme.colorScheme.onSurface.withValues(alpha: 0.4);

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: 64,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              decoration: BoxDecoration(
                color: isActive ? activeColor.withValues(alpha: 0.15) : Colors.transparent,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                icon,
                size: 24,
                color: isActive ? activeColor : inactiveColor,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                color: isActive ? activeColor : inactiveColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
