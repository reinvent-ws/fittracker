# 🏋️ FitTracker

**AI-powered workout tracker** — track your workouts with a live timer, get AI-powered exercise guidance and tips, and log every session to follow your fitness journey with detailed analytics.

🇧🇷 [Leia em Português](./README.pt-BR.md)

---

## ✨ About

FitTracker helps you plan, run, and review your workouts. Start a session, track sets and reps in real time with a live timer, get AI-driven exercise guidance, and see your progress over time through detailed statistics.

## 🚀 Features

- 🔐 **Login** — authentication flow
- 🏠 **Home** — dashboard overview
- 🏋️ **Exercises** — browse the exercise library
- 📋 **Workouts** — create and manage workout plans
- ⏱️ **Active Workout** — live session with timer, sets, and reps
- 📊 **History** — past workout logs
- 👤 **Profile** — user settings and stats

## 🧱 Tech Stack

- **Mobile app:** React Native + Expo (Expo Router)
- **Content backend:** Sanity.io + GROQ
- **State management:** Zustand
- **Styling:** NativeWind (Tailwind for React Native)
- **Language:** TypeScript

## 📦 Monorepo Structure

```
fittracker/
├── apps/
│   ├── api/       # Sanity Studio + GROQ schemas/queries
│   └── mobile/     # React Native + Expo app (login, workouts, exercises)
```

## 🏁 Getting Started

### Prerequisites

- Node.js (LTS)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- A Sanity.io account and project

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/fittracker.git
cd fittracker

# Install dependencies
npm install
```

### Running the API (Sanity Studio)

```bash
cd apps/api
npm install
npm run dev
```

### Running the Mobile App

```bash
cd apps/mobile
npm install
npx expo start
```

### Environment Variables

Create a `.env` (or `.env.local`) file in `apps/mobile` with:

```
EXPO_PUBLIC_SANITY_PROJECT_ID=your_project_id
EXPO_PUBLIC_SANITY_DATASET=production
```

## 🗺️ Roadmap

- [ ] AI-powered exercise recommendations
- [ ] Progress charts and analytics dashboard
- [ ] Social/sharing features
- [ ] Offline mode

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
