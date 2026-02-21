import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'shared_preferences_provider.dart';

final themeProvider = NotifierProvider<ThemeNotifier, bool>(() {
  return ThemeNotifier();
});

class ThemeNotifier extends Notifier<bool> {
  @override
  bool build() {
    final prefs = ref.watch(sharedPreferencesProvider);
    return prefs.getBool('isDark') ?? true;
  }

  void toggle() {
    state = !state;
    ref.read(sharedPreferencesProvider).setBool('isDark', state);
  }
}
