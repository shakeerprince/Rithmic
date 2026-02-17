import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:uuid/uuid.dart';

import '../../../../core/constants/app_constants.dart';
import '../../data/models/habit_model.dart';
import '../../domain/providers/habit_providers.dart';

class CreateHabitScreen extends ConsumerStatefulWidget {
  const CreateHabitScreen({super.key});

  @override
  ConsumerState<CreateHabitScreen> createState() => _CreateHabitScreenState();
}

class _CreateHabitScreenState extends ConsumerState<CreateHabitScreen> {
  final _nameController = TextEditingController();
  String _category = 'Health';
  String _frequency = 'Daily';
  TimeOfDay _startTime = const TimeOfDay(hour: 6, minute: 0);
  TimeOfDay _endTime = const TimeOfDay(hour: 7, minute: 0);
  bool _reminder = true;
  final List<int> _selectedDays = [1, 2, 3, 4, 5, 6, 7];
  int _selectedColor = 0xFF4ADE80;

  final _colors = [
    0xFF4ADE80, 0xFF6CB4EE, 0xFFCB6CE6, 0xFFFFD93D,
    0xFFFF6B6B, 0xFFFF8C42, 0xFFC8E600, 0xFF00D4AA,
  ];

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('New Habit'),
        leading: IconButton(
          icon: const Icon(Icons.close_rounded),
          onPressed: () => context.pop(),
        ),
        actions: [
          TextButton(
            onPressed: _saveHabit,
            child: Text('Save',
                style: TextStyle(
                  color: theme.colorScheme.primary,
                  fontWeight: FontWeight.w700,
                )),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ─── Name ─────────────────────────────
            Text('Habit Name', style: theme.textTheme.titleSmall),
            const SizedBox(height: 8),
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                hintText: 'e.g. Morning Run, Read 30 Pages...',
              ),
              textCapitalization: TextCapitalization.words,
            ),

            const SizedBox(height: 24),

            // ─── Category ─────────────────────────
            Text('Category', style: theme.textTheme.titleSmall),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: AppConstants.habitCategories.map((cat) {
                final isSelected = _category == cat;
                return GestureDetector(
                  onTap: () => setState(() => _category = cat),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? theme.colorScheme.primary
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: isSelected
                            ? theme.colorScheme.primary
                            : theme.colorScheme.outline.withValues(alpha: 0.4),
                      ),
                    ),
                    child: Text(
                      cat,
                      style: theme.textTheme.labelMedium?.copyWith(
                        color: isSelected
                            ? theme.colorScheme.onPrimary
                            : null,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),

            const SizedBox(height: 24),

            // ─── Time ─────────────────────────────
            Text('Time', style: theme.textTheme.titleSmall),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _TimePickerTile(
                    label: 'Start',
                    time: _startTime,
                    onTap: () async {
                      final picked = await showTimePicker(
                        context: context,
                        initialTime: _startTime,
                      );
                      if (picked != null) setState(() => _startTime = picked);
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _TimePickerTile(
                    label: 'End',
                    time: _endTime,
                    onTap: () async {
                      final picked = await showTimePicker(
                        context: context,
                        initialTime: _endTime,
                      );
                      if (picked != null) setState(() => _endTime = picked);
                    },
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // ─── Frequency ─────────────────────────
            Text('Frequency', style: theme.textTheme.titleSmall),
            const SizedBox(height: 8),
            Row(
              children: AppConstants.frequencies.map((freq) {
                final isSelected = _frequency == freq;
                return Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _frequency = freq),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? theme.colorScheme.primary.withValues(alpha: 0.15)
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected
                              ? theme.colorScheme.primary
                              : theme.colorScheme.outline.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Center(
                        child: Text(
                          freq,
                          style: theme.textTheme.labelMedium?.copyWith(
                            color: isSelected ? theme.colorScheme.primary : null,
                            fontWeight: isSelected ? FontWeight.w700 : null,
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),

            if (_frequency == 'Custom') ...[
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: List.generate(7, (i) {
                  final day = i + 1;
                  final isSelected = _selectedDays.contains(day);
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        if (isSelected) {
                          _selectedDays.remove(day);
                        } else {
                          _selectedDays.add(day);
                        }
                      });
                    },
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isSelected
                            ? theme.colorScheme.primary
                            : Colors.transparent,
                        border: Border.all(
                          color: isSelected
                              ? theme.colorScheme.primary
                              : theme.colorScheme.outline.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Center(
                        child: Text(
                          AppConstants.daysShort[i].substring(0, 1),
                          style: theme.textTheme.labelMedium?.copyWith(
                            color: isSelected ? theme.colorScheme.onPrimary : null,
                          ),
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ],

            const SizedBox(height: 24),

            // ─── Color ─────────────────────────────
            Text('Color', style: theme.textTheme.titleSmall),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: _colors.map((color) {
                final isSelected = _selectedColor == color;
                return GestureDetector(
                  onTap: () => setState(() => _selectedColor = color),
                  child: Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Color(color),
                      border: isSelected
                          ? Border.all(color: Colors.white, width: 3)
                          : null,
                      boxShadow: isSelected
                          ? [BoxShadow(
                              color: Color(color).withValues(alpha: 0.5),
                              blurRadius: 8,
                            )]
                          : null,
                    ),
                  ),
                );
              }).toList(),
            ),

            const SizedBox(height: 24),

            // ─── Reminder ─────────────────────────
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: theme.colorScheme.outline.withValues(alpha: 0.3)),
              ),
              child: SwitchListTile(
                title: Text('Reminder', style: theme.textTheme.titleSmall),
                subtitle: Text('Get notified before habit time',
                    style: theme.textTheme.bodySmall),
                value: _reminder,
                onChanged: (v) => setState(() => _reminder = v),
                activeTrackColor: theme.colorScheme.primary,
                contentPadding: EdgeInsets.zero,
              ),
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  void _saveHabit() {
    if (_nameController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a habit name')),
      );
      return;
    }

    final habit = HabitModel(
      id: const Uuid().v4(),
      name: _nameController.text.trim(),
      category: _category,
      startHour: _startTime.hour,
      startMinute: _startTime.minute,
      endHour: _endTime.hour,
      endMinute: _endTime.minute,
      daysOfWeek: _selectedDays,
      frequency: _frequency,
      reminderEnabled: _reminder,
      createdAt: DateTime.now(),
      colorValue: _selectedColor,
    );

    ref.read(habitsProvider.notifier).addHabit(habit);
    context.pop();
  }
}

class _TimePickerTile extends StatelessWidget {
  final String label;
  final TimeOfDay time;
  final VoidCallback onTap;

  const _TimePickerTile({
    required this.label,
    required this.time,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: theme.cardTheme.color,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: theme.colorScheme.outline.withValues(alpha: 0.3)),
        ),
        child: Row(
          children: [
            Icon(Icons.access_time_rounded, size: 18,
                color: theme.colorScheme.primary),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: theme.textTheme.labelSmall?.copyWith(
                  color: theme.textTheme.bodySmall?.color,
                )),
                Text(time.format(context),
                    style: theme.textTheme.titleSmall),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
