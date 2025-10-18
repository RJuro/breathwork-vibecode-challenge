Based on my research, here's the improved specification:

## Breathwork App Specification

### 1. **Core Technique**
Progressive box breathing from 4-4-4-4 (beginner) to advanced patterns with extended retention holds (8-20-12-10 or similar). Focus on CO2 tolerance building through gradual progression, not hyperventilation.

### 2. **Pre-Built Programs**
5 programs: Beginner (4-4-4-4, 5min), Stress Relief (4-7-8-0, 7min), Intermediate (5-5-5-5 or 6-6-6-6, 10min), Advanced (8-8-10-8 with extended exhales/retention, 12min), Quick Reset (3-3-3-3, 3min).

### 3. **Session Flow**
5-second preparation countdown, full-screen minimal interface during session with current phase indicator, completion screen showing total time and breaths. Small pause button in corner (no other controls).

### 4. **Visual Design**
Central expanding/contracting circle synchronized to breathing phases with color gradients (cool blues for inhale/hold, warm amber/orange for exhale/hold). Dark mode default, Tailwind-based minimal UI, 60fps CSS animations.

### 5. **Audio Features**
Optional simple tone/chime at phase transitions (inhale/hold/exhale markers). No voice guidance. Background audio support when phone locked via service worker.

### 6. **Customization**
Custom program builder: set individual timing for inhale/hold-top/exhale/hold-bottom (2-30s each phase). 3 visual theme presets (color variations). Haptic vibration toggle for phase transitions.

### 7. **Tech Stack**
React with hooks for timer/state management, Tailwind for styling and animations, localStorage for preferences and custom programs only. Service worker for background audio. No authentication or cloud sync.

### 8. **UI Structure**
Single-page app: Home screen shows 5 preset programs + custom option, tapping launches 5-sec countdown then full-screen breathing interface. Settings accessible via gear icon (themes, haptics, audio toggle).

### 9. **Onboarding**
First launch shows brief text-only tutorial screen explaining box breathing concept and benefits (stress reduction, focus, nervous system regulation). Dismissible, never shown again. Keep under 50 words.

### 10. **Safety**
Prominent warning on first launch: "Do not use while driving or operating machinery. Stop if dizzy or lightheaded." Max hold times capped at 30s in custom builder. Sessions auto-complete at set duration with gentle fade-out.