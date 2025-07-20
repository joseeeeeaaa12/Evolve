# Evolve - Intelligent Strength Training Webapp

**Progressive overload made simple.**

Evolve is a minimalist, intelligent strength training webapp that completely automates progressive overload. It acts as your personal digital spotter and programmer, removing the guesswork from lifting by tracking every lift and telling you exactly what weight, sets, and reps to perform in your next session.

## 🚀 Features

### 🎯 Foundation Session - Strength Calibration
- **One-time onboarding workout** to establish strength baseline
- **AMRAP testing** for core compound exercises (Squat, Bench, Deadlift, Overhead Press)
- **Automatic 1RM calculation** using the Epley formula
- **Personalized program generation** based on your strength levels

### 🧠 Evolve Engine - Intelligent Progression
- **Automatic weight progression** based on performance
- **Smart plateau detection** and deload suggestions  
- **Success tracking** - increase weight when all reps completed
- **Failure handling** - maintain weight until mastery achieved
- **RPE/RIR integration** for advanced users

### 💪 In-Gym Experience - Zen-like Focus
- **Minimalist dark UI** designed for gym environments
- **Large, tappable elements** for easy use during workouts
- **Automatic rest timer** starts after each completed set
- **Weight adjustment** on-the-fly
- **Progress tracking** with visual feedback
- **PR celebrations** for motivation

### 📊 Progress & Analytics
- **Strength progression charts** for all major lifts
- **Volume tracking** over time
- **Personal record management** 
- **Workout history** and statistics
- **Motivational insights** based on your progress

### ⚙️ Smart Features
- **Persistent data** - your progress is saved locally
- **Responsive design** - works on mobile and desktop
- **Offline capable** - no internet required during workouts
- **Notification support** - rest timer alerts
- **Haptic feedback** for satisfying interactions

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence
- **Charts**: Recharts for progress visualization
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Date Handling**: date-fns

## 🎨 Design Philosophy

**Calm-tech aesthetic** with:
- Deep charcoal/navy primary colors
- Electric blue and soft neon green accents
- Inter font family for maximum legibility
- Smooth animations and haptic feedback
- Glass morphism effects
- Minimal, distraction-free interface

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd evolve-webapp
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 📱 Usage Guide

### First Time Setup
1. **Welcome Screen** - Learn about the Foundation session
2. **Foundation Workout** - Complete AMRAP sets for core exercises
3. **Results Review** - See your estimated 1RMs and generated program
4. **Start Training** - Begin your intelligent progression journey

### Regular Workouts
1. **Dashboard** - View your next workout and recent progress
2. **Start Workout** - Follow the prescribed weights and reps
3. **Track Sets** - Log each set with actual reps completed
4. **Rest Timer** - Automatic timer starts after each set
5. **Progress** - Evolve automatically calculates your next session

### Progress Tracking
- **Charts** show strength progression over time
- **Personal Records** are automatically detected and celebrated
- **Volume tracking** helps monitor training load
- **Statistics** provide insights into your evolution

## 🔧 Configuration

### User Preferences
- **Units**: Switch between lbs and kg
- **Rest Time**: Customize default rest periods
- **Sound/Haptic**: Toggle feedback preferences
- **Profile**: Set your name and preferences

### Progressive Overload Logic
- **Success**: +2.5-5 lbs when all target reps completed
- **Struggle**: Maintain weight until mastery
- **Plateau**: 15% deload after 2-3 failed sessions
- **Advanced**: Automatic rep/set adjustments near 1RM

## 🏗️ Architecture

### State Management
```typescript
// Zustand store with persistence
useAppStore = {
  user: User | null
  currentWorkout: Workout | null
  workoutHistory: Workout[]
  exercises: Exercise[]
  timer: TimerState
}
```

### Key Components
- `Foundation` - Onboarding strength testing
- `Dashboard` - Main hub with next workout
- `Workout` - In-gym training interface  
- `Progress` - Charts and analytics
- `Settings` - User preferences
- `Timer` - Floating rest timer
- `Layout` - Navigation and structure

### Progression Algorithm
```typescript
// Intelligent weight progression
generateProgression(rule, oneRM, units) => {
  weight: number    // Next session weight
  reps: number      // Target reps
  sets: number      // Target sets
}
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:
- Code style and standards
- Pull request process
- Issue reporting
- Feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Strength training community** for inspiration
- **Progressive overload pioneers** like Mark Rippetoe and Jim Wendler
- **Minimalist design movement** for aesthetic guidance
- **Open source contributors** who made this possible

---

**Built with ❤️ for strength athletes who want to focus on lifting, not calculating.**

*"The groundwork for all happiness is good health."* — Leigh Hunt