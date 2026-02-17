# Rithmic — Build Habits, Together.

![Rithmic Banner](https://raw.githubusercontent.com/shakeerprince/Rithmic/main/web/frontend/public/logo.png)

**Rithmic** is a premium habit tracking platform designed to conform to your lifestyle. It combines powerful personal tracking with social accountability, challenges, and deeply integrated gamification.

## 📱 Mobile App (Flutter)
A seamless cross-platform mobile experience built for performance and fluidity.

### Tech Stack
- **Framework**: Flutter (Dart)
- **State Management**: Riverpod 2.0 (Generator)
- **Navigation**: GoRouter
- **Persistence**: Shared Preferences / Local Storage
- **Charts**: FL Chart
- **Notifications**: Flutter Local Notifications

## 🌐 Web Platform (Next.js + Hono)
A unified, modern dashboard serveing as your productivity command center.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend API**: Hono (running on Bun Runtime)
- **Database**: SQLite (via Drizzle ORM + Better-SQLite3)
- **Authentication**: JWT-based secure auth
- **Design**: Custom neon-glassmorphism UI system

## ✨ Key Features
- **Habit Tracking**: Flexible schedules, streak tracking, and detailed analytics.
- **Social Connectivity**: Add friends, view leaderboards, and join community challenges.
- **Gamification Engine**: Earn XP, climb levels (Bronze -> Diamond), and unlock achievement badges.
- **Unified Dashboard**: A single view for habits, social updates, and daily motivation.
- **Smart Notifications**: Intelligent reminders to keep you on track.

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/shakeerprince/Rithmic.git
cd Rithmic
```

### 2. Run the Web Platform

#### Backend Setup
```bash
cd web/backend
bun install
bun run db:push  # Push schema to SQLite
bun run --watch src/index.ts
```
The backend runs on `http://localhost:3001`.

#### Frontend Setup
```bash
cd web/frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:3000`.

### 3. Run the Mobile App
Ensure you have the Flutter SDK installed on your machine.
```bash
# From project root
flutter pub get
flutter run
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
MIT License

---
Developed by [Shakeer Prince](https://github.com/shakeerprince)
