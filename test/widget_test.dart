import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:habit_circle/app.dart';

void main() {
  testWidgets('App renders successfully', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: HabitCircleApp()),
    );
    await tester.pumpAndSettle();
    expect(find.text('HabitCircle'), findsAny);
  });
}
