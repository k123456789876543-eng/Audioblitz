# 🎧 AuraBoost

> *Calm the fear. Own the moment.*

**AuraBoost** is a cross-platform confidence and focus app built for introverts, anxiety-prone individuals, and performers who need an instant mental edge before high-stakes moments — whether that's speaking in front of 100,000 people, walking into a critical meeting, or simply getting out the door on a hard day.

It delivers scientifically-inspired binaural beats, solfeggio frequencies, and generative ambient soundscapes through headphones, with effects typically onset in 5–20 minutes.

---

## Table of Contents

- [Why AuraBoost](#why-auraboost)
- [The Science](#the-science)
- [Features](#features)
- [App Screens](#app-screens)
- [Audio Engine](#audio-engine)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup)
- [Running on iOS](#running-on-ios)
- [Running on Android](#running-on-android)
- [Running as Web App](#running-as-web-app)
- [Audio Architecture](#audio-architecture)
- [Personalization Engine](#personalization-engine)
- [Monetization](#monetization)
- [Accessibility](#accessibility)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## Why AuraBoost

Stage fright is physiological. Before a high-pressure event, cortisol spikes, heart rate climbs, and the prefrontal cortex — responsible for clear thinking — goes partially offline. Traditional advice like "just breathe" or "picture the audience in their underwear" doesn't touch the neurological root of anxiety.

AuraBoost works differently. By delivering precisely-tuned binaural beats through headphones, it entrains brainwave activity toward alpha and theta states associated with calm alertness. Ambient soundscapes provide a sensory anchor. Subliminal affirmations at –30dB prime confidence without conscious resistance. Together, these inputs create a neurological environment where peak performance becomes the path of least resistance.

The app is designed for people who feel deeply, think in overdrive, and just need the right conditions to let their real self show up.

---

## The Science

### Binaural Beats & Frequency Following Response

When two slightly different sine wave frequencies are delivered to each ear separately (e.g., 200Hz left, 210Hz right), the brain perceives a phantom beat at the difference frequency (10Hz). This perceived beat is not an auditory illusion — it produces a measurable shift in brainwave activity toward the target frequency, a phenomenon called the **Frequency Following Response (FFR)**.

| Brainwave Band | Frequency Range | Associated State | AuraBoost Use Case |
|---|---|---|---|
| Delta | 0.5 – 4 Hz | Deep sleep, recovery | Post-event reset, sleep pack |
| Theta | 4 – 8 Hz | Deep relaxation, creativity | Pre-stage calm, anxiety reduction |
| Alpha | 8 – 14 Hz | Calm alertness, flow state | Stage King mode, focus |
| Beta | 14 – 30 Hz | Active thinking, engagement | Dopamine boost, social ease |
| Gamma | 30+ Hz | Hyper-focus, peak cognition | Advanced premium pack |

### Solfeggio Frequencies

Ancient tonal scales that certain researchers associate with physiological and psychological effects. AuraBoost uses them as binaural carrier frequencies — the science is debated but the user experience is consistent and positive.

| Frequency | Traditional Name | AuraBoost Association |
|---|---|---|
| 396 Hz | UT | Fear release |
| 528 Hz | MI | Confidence & transformation |
| 639 Hz | FA | Connection & social ease |
| 741 Hz | SOL | Expression & voice clarity |
| 852 Hz | LA | Intuition & spiritual order |

### Cortisol & Dopamine Pathway

Repetitive rhythmic audio stimulation activates the brain's reward entrainment system — the same circuit involved in music-induced chills and runner's high. This produces modest dopamine release without any substance, building positive association with the pre-performance ritual over time. Users report that AuraBoost sessions become an anchor — a learned neurological shortcut to calm confidence.

> **Important:** AuraBoost is scientifically-inspired, not clinically certified. It does not diagnose, treat, or cure any condition. For clinical anxiety disorders, please consult a licensed professional.

---

## Features

### ⚡ Emergency Boost Mode
One-tap rescue protocol for acute stage fright. Triggers a 3-second countdown, then runs a 5-minute guided session with:
- Alpha 10Hz binaural beats at full volume
- Guided 4-4-4 breathing cycle with visual orb
- Rotating subliminal affirmations at –30dB
- Forest ambient layer for grounding

### 🎚 Custom Soundscape Mixer
Build and save named personal mixes via an infinite-layer mixer:
- Choose a base solfeggio carrier frequency (396–852Hz)
- Pick a binaural beat offset (0.5–30Hz mapped to brainwave bands)
- Layer ambient sounds with independent volume sliders
- Toggle subliminal affirmations and breathing guide
- Preview mix in-app before saving
- Save unlimited named mixes (Free: 3, Pro: unlimited)

### 🏠 Quick Boost Home
- Hero play orb with animated progress ring
- Live waveform visualizer synced to active audio
- 4 duration options: 5 / 10 / 15 / 20 min
- Binaural and Isochronic tone mode toggle
- One-scroll preset carousel with 6 included presets

### 🎵 Sound Library
- 5 solfeggio frequency presets (tap to preview)
- 5 generative ambient soundscapes
- 4 binaural beat packs (Free: 1, Pro: all 4)
- Future: user-uploaded custom ambiences

### 📊 Journey & Progress Tracking
- Post-session mood log (1–5 emoji scale)
- Streak calendar with 7-day view
- Stat summary: sessions, total minutes, average mood
- AI-style insight cards ("Your forest sessions improve confidence 32% faster")
- 6 achievement badges with unlock conditions

### 🧩 Personalization Engine
- 3-step onboarding quiz captures anxiety triggers, use case, and vibe preference
- Results map to a recommended starting preset
- Session history trains a simple weighted preference model (Firebase ML Kit)
- Anxiety profile radar chart in Profile screen

### ❤️ Heart Rate Adaptation (Pro)
- Camera-based rPPG heart rate estimation (no wearable needed)
- Optional HealthKit / Google Fit sync for wearable HR
- Adaptive algorithm: if HR spikes >20% above baseline, automatically ramps binaural frequency toward delta (calming)
- Manual override always available

### 🌿 Offline First
- All 6 free presets bundled and available offline
- Pro users can download premium packs to device
- Session logs sync to Firebase when connection restores
- No ads, ever

---

## App Screens

```
┌─────────────────────────────────┐
│         BOTTOM NAVIGATION       │
│  ⚡ Boost  🎛 Studio  🎵 Sounds  │
│  📊 Journey  🧠 Profile          │
└─────────────────────────────────┘
```

### Boost (Home)
The primary screen. The animated aurora background responds to whether audio is playing. The central orb acts as the play/pause button with a circular progress ring. Below it: duration pills, tone mode toggle, mix sliders for binaural and ambient volume, a horizontal preset carousel, and the Emergency Boost CTA banner.

### Studio (Mixer)
A layered mixing desk interface. Top section selects the solfeggio base frequency from a horizontal scrollable row. Below that, the ambient type selector. Then the 4 sound layers — each with an on/off toggle and a custom-colored volume slider. A live waveform preview bar with a preview button sits at the bottom, above the save-mix input.

### Sounds (Library)
A catalog view. Solfeggio frequency entries are interactive rows that play a preview tone when tapped. Ambient soundscape cards are displayed in a 2-column grid. Binaural pack cards show free/pro status badges.

### Journey (Progress)
Three stat tiles at the top (sessions, minutes, average mood). Pending session mood rating prompt appears when a session has been completed but not yet rated. Insight banner auto-generates based on session patterns. Badge grid (3-column) shows earned and locked states. Streak calendar. Reverse-chronological session history list.

### Profile
User avatar orb, level badge, and earned tags. Anxiety profile bar chart. App settings toggles (notifications, haptics, offline downloads). Subliminal volume slider. Science footnote. Pro upgrade card.

### Onboarding
3-step quiz with smooth page transitions. Each step presents a question with 4 tappable answers. Selections are not validated — any answer advances the flow. Results are stored locally and used to seed the personalization engine.

### Emergency Modal
Full-screen overlay with aurora background. Phase 1: 3-second countdown with gold typography. Phase 2: animated breathing orb with scale transitions (inhale expand, exhale contract), rotating affirmations, waveform, and a linear progress bar. Phase 3: completion screen with "You Are Ready" message.

---

## Audio Engine

### Web Implementation (Prototype)
The React prototype uses the **Web Audio API** directly — no external audio files required. All sound is synthesized in real time.

**Binaural beats** use a `ChannelMergerNode` to create true stereo output:
```
OscillatorNode (baseHz) → GainNode → ChannelMergerNode (left channel)
OscillatorNode (baseHz + beatHz) → GainNode → ChannelMergerNode (right channel)
ChannelMergerNode → MasterGainNode → AudioContext.destination
```

**Ambient soundscapes** are generated from raw PCM `AudioBuffer` objects:
- Rain: White noise with amplitude modulation
- Ocean: Slow sinusoidal amplitude envelope with noise layer
- Fire: Pink-ish noise with random crackle impulses
- Forest: Low-frequency wind shimmer with leaf rustle layer
- Wind: Amplitude-modulated sine with noise

All ambient buffers are 4 seconds long and loop seamlessly. A low-pass `BiquadFilterNode` shapes the tone for each type.

**Isochronic tones** use a square-wave LFO connected to an oscillator's gain:
```
OscillatorNode (carrier) → GainNode ← LFO OscillatorNode (beatHz, square wave)
GainNode → MasterGainNode
```

Volume transitions use `setTargetAtTime` for smooth parameter changes without zipper noise.

### Flutter Native Implementation

For production iOS/Android builds, replace the Web Audio engine with:

```dart
// Binaural engine uses flutter_sound for raw PCM playback
// Generates 32-bit float samples at 44100Hz
// Left channel: sin(2π × baseHz × t)
// Right channel: sin(2π × (baseHz + beatHz) × t)
// Feeds to FlutterSoundPlayer via startPlayerFromStream
```

Key packages:
- `flutter_sound: ^9.2.13` — PCM stream playback, binaural generation
- `just_audio: ^0.9.36` — Ambient MP3/WAV loop playback
- `audio_session: ^0.1.18` — Background audio, interruption handling

The ambient layer uses pre-mastered 320kbps MP3 files bundled in `assets/audio/` rather than runtime synthesis, ensuring consistent audio quality across all devices.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend (Web prototype)** | React 18 + Web Audio API |
| **Frontend (Native)** | Flutter 3.x (Dart) |
| **State Management** | Flutter Riverpod 2.x |
| **Backend** | Firebase (Auth, Firestore, Storage) |
| **Personalization** | Firebase ML Kit (on-device model) |
| **Health Integration** | HealthKit (iOS) + Google Fit (Android) |
| **Local Storage** | Hive (Flutter) |
| **Animations** | flutter_animate, Lottie |
| **Charts** | fl_chart |
| **Purchases** | in_app_purchase |
| **Audio** | flutter_sound + just_audio |

---

## Project Structure

```
auraboost/
│
├── lib/
│   ├── main.dart                        # App entry point
│   ├── app.dart                         # Root widget, theme, routing
│   │
│   ├── core/
│   │   ├── audio/
│   │   │   ├── binaural_engine.dart     # PCM tone generator, channel merger
│   │   │   ├── ambient_layer.dart       # just_audio ambient player wrapper
│   │   │   ├── isochronic_engine.dart   # Square-wave LFO pulsed tones
│   │   │   └── subliminal_mixer.dart    # –30dB affirmation audio injection
│   │   │
│   │   ├── models/
│   │   │   ├── preset.dart              # Preset data model
│   │   │   ├── session_log.dart         # Session history entry
│   │   │   ├── boost_mix.dart           # User-saved custom mix
│   │   │   └── user_profile.dart        # Anxiety profile, prefs
│   │   │
│   │   ├── services/
│   │   │   ├── firebase_service.dart    # Auth, Firestore CRUD
│   │   │   ├── sync_service.dart        # Offline queue + sync
│   │   │   ├── health_service.dart      # HealthKit / Google Fit bridge
│   │   │   ├── hr_adaptive.dart         # HR spike detection + frequency ramp
│   │   │   └── ml_personalization.dart  # On-device recommendation model
│   │   │
│   │   └── theme/
│   │       ├── colors.dart              # Color tokens
│   │       ├── typography.dart          # Font styles
│   │       └── app_theme.dart           # ThemeData (dark + light)
│   │
│   ├── features/
│   │   ├── onboarding/
│   │   │   ├── onboarding_screen.dart
│   │   │   └── onboarding_controller.dart
│   │   │
│   │   ├── home/
│   │   │   ├── home_screen.dart         # Main boost screen
│   │   │   ├── play_orb_widget.dart     # Animated play ring + orb
│   │   │   ├── preset_carousel.dart     # Horizontal preset scroll
│   │   │   └── mix_sliders.dart         # Binaural + ambient volume controls
│   │   │
│   │   ├── emergency/
│   │   │   ├── emergency_modal.dart     # Full-screen emergency boost
│   │   │   ├── breathing_orb.dart       # Animated inhale/exhale circle
│   │   │   └── affirmation_ticker.dart  # Rotating text overlay
│   │   │
│   │   ├── mixer/
│   │   │   ├── mixer_screen.dart        # Custom soundscape studio
│   │   │   ├── frequency_selector.dart  # Solfeggio picker
│   │   │   ├── ambient_selector.dart    # Ambient type picker
│   │   │   ├── layer_card.dart          # Toggleable sound layer
│   │   │   └── mix_preview_bar.dart     # Waveform + preview button
│   │   │
│   │   ├── tracks/
│   │   │   ├── tracks_screen.dart       # Sound library catalog
│   │   │   ├── solfeggio_row.dart       # Tappable frequency preview
│   │   │   └── pack_card.dart           # Binaural pack tile
│   │   │
│   │   ├── journey/
│   │   │   ├── journey_screen.dart      # Progress & gamification
│   │   │   ├── mood_rater.dart          # Emoji rating widget
│   │   │   ├── badge_grid.dart          # Achievement display
│   │   │   ├── streak_calendar.dart     # 7-day streak visual
│   │   │   └── insight_card.dart        # Auto-generated insight
│   │   │
│   │   └── profile/
│   │       ├── profile_screen.dart      # Settings + upgrade
│   │       ├── anxiety_profile.dart     # Animated bar chart
│   │       └── upgrade_card.dart        # Pro paywall component
│   │
│   └── widgets/
│       ├── wave_visualizer.dart         # Animated bar chart audio vis
│       ├── aurora_background.dart       # Animated gradient aurora
│       ├── particle_field.dart          # Floating particle overlay
│       ├── custom_slider.dart           # Styled range slider
│       ├── toggle_switch.dart           # Animated toggle
│       └── card_surface.dart            # Glassmorphic card base
│
├── assets/
│   ├── audio/
│   │   ├── ambient/
│   │   │   ├── forest_dawn.mp3          # 320kbps, 4-min looping
│   │   │   ├── ocean_waves.mp3
│   │   │   ├── rain_leaves.mp3
│   │   │   ├── crackling_fire.mp3
│   │   │   └── wind_chimes.mp3
│   │   └── affirmations/
│   │       ├── stage_confidence.mp3     # Whispered at –30dB
│   │       └── social_ease.mp3
│   │
│   ├── fonts/
│   │   ├── CormorantGaramond/           # Display font
│   │   └── Nunito/                      # Body font
│   │
│   ├── lottie/
│   │   ├── breathing_orb.json
│   │   └── aurora_particles.json
│   │
│   └── images/
│       └── onboarding_illustrations/
│
├── test/
│   ├── unit/
│   │   ├── binaural_engine_test.dart
│   │   └── ml_personalization_test.dart
│   └── widget/
│       ├── home_screen_test.dart
│       └── emergency_modal_test.dart
│
├── pubspec.yaml
├── firebase.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Flutter SDK](https://docs.flutter.dev/get-started/install) 3.16+
- [Dart](https://dart.dev/get-dart) 3.0+
- [Node.js](https://nodejs.org/) 18+ (for Firebase CLI)
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`
- Xcode 15+ (iOS/macOS builds)
- Android Studio with SDK 34+ (Android builds)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/auraboost.git
cd auraboost

# 2. Install Flutter dependencies
flutter pub get

# 3. Install Firebase CLI and log in
npm install -g firebase-tools
firebase login

# 4. Configure Firebase for your project (see Firebase Setup below)
flutterfire configure

# 5. Check your setup
flutter doctor
```

---

## Environment Variables

Create a `.env` file in the project root (never commit this):

```env
# Firebase (auto-generated by flutterfire configure — keep as backup)
FIREBASE_API_KEY=your_api_key
FIREBASE_APP_ID=your_app_id
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_MESSAGING_SENDER_ID=your_sender_id

# Revenue Cat (in-app purchases)
REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxx
REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxx

# Optional: Sentry error tracking
SENTRY_DSN=https://xxxx@sentry.io/xxxx
```

Load via `flutter_dotenv` in `main.dart`:
```dart
await dotenv.load(fileName: ".env");
```

---

## Firebase Setup

### 1. Create a Firebase Project

Go to [console.firebase.google.com](https://console.firebase.google.com) → Add project → name it `auraboost-prod`.

### 2. Enable Services

In the Firebase Console:
- **Authentication** → Sign-in method → Enable "Anonymous" and "Email/Password"
- **Firestore Database** → Create database → Start in production mode
- **Storage** → Get started (for user-uploaded ambiences)
- **ML Kit** → Custom models (upload personalization model)

### 3. Firestore Schema

```
/users/{userId}
  - email: string
  - createdAt: timestamp
  - profile: {
      anxietyTrigger: string,
      preferredAmbient: string,
      preferredFreqHz: number
    }

  /sessions/{sessionId}
    - presetId: number
    - presetName: string
    - durationMin: number
    - mood: number (0–4, null if unrated)
    - beatHz: number
    - ambientType: string
    - completedAt: timestamp

  /mixes/{mixId}
    - name: string
    - baseFreqHz: number
    - beatHz: number
    - ambientType: string
    - layers: array
    - createdAt: timestamp

/presets/{presetId}           # (read-only, seeded by admin)
  - name: string
  - beatHz: number
  - baseHz: number
  - ambient: string
  - isPremium: boolean
```

### 4. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Presets are public read
    match /presets/{presetId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### 5. Run Firebase Emulator (local dev)

```bash
firebase emulators:start --only auth,firestore,storage
```

Then in `main.dart`, point to emulator when in debug mode:
```dart
if (kDebugMode) {
  await FirebaseFirestore.instance.useFirestoreEmulator('localhost', 8080);
  await FirebaseAuth.instance.useAuthEmulator('localhost', 9099);
}
```

---


### Responsive Layout (Desktop + Mobile)

`AuraBoost.jsx` now includes a responsive shell:
- **Desktop/Web (>= 921px):** split layout with a web info panel + app device frame
- **Mobile/Tablet (< 921px):** original focused single-column mobile experience

This keeps the interaction model mobile-first while making large screens visually balanced.

### Expo Mobile Testing Wrapper

An Expo wrapper is available in `expo-mobile/` so you can test the web build on your phone quickly:

```bash
# 1) Run the React app first (Vite)
npm run dev -- --host

# 2) In another terminal
cd expo-mobile
npm install

# 3) Update WEB_APP_URL in expo-mobile/App.js
#    Use your computer's LAN IP + Vite port (example: http://192.168.1.100:5173)

# 4) Start Expo
npm run start
```

Then open Expo Go on your phone and scan the QR.

## Running on iOS

```bash
# Open in Xcode first to configure signing
open ios/Runner.xcworkspace

# Then run from terminal
flutter run -d iPhone  # or specific device ID

# Release build
flutter build ipa --release
```

**Required iOS permissions** (add to `ios/Runner/Info.plist`):
```xml
<key>NSMicrophoneUsageDescription</key>
<string>AuraBoost uses the microphone for camera-based heart rate monitoring.</string>

<key>NSCameraUsageDescription</key>
<string>AuraBoost optionally uses the camera to measure your heart rate.</string>

<key>NSHealthShareUsageDescription</key>
<string>AuraBoost reads heart rate data to adapt audio intensity during sessions.</string>

<key>NSHealthUpdateUsageDescription</key>
<string>AuraBoost logs session mindfulness minutes to Apple Health.</string>

<key>UIBackgroundModes</key>
<array>
  <string>audio</string>
</array>
```

**HealthKit entitlements** (`ios/Runner/Runner.entitlements`):
```xml
<key>com.apple.developer.healthkit</key>
<true/>
<key>com.apple.developer.healthkit.access</key>
<array>
  <string>health-records</string>
</array>
```

---

## Running on Android

```bash
# Run on connected device or emulator
flutter run -d android

# Release APK
flutter build apk --release

# Release App Bundle (for Play Store)
flutter build appbundle --release
```

**Required Android permissions** (add to `android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.RECORD_AUDIO"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK"/>

<!-- For background audio playback -->
<service
  android:name=".AudioPlayerService"
  android:foregroundServiceType="mediaPlayback"
  android:exported="false"/>
```

**Minimum SDK**: 23 (Android 6.0) — set in `android/app/build.gradle`:
```gradle
defaultConfig {
    minSdkVersion 23
    targetSdkVersion 34
}
```

---

## Running as Web App (React Prototype)

This repository is now Vite-ready for web deployment (including Vercel):

```bash
npm install
npm run dev

# Production build
npm run build
```

If you deploy to Vercel, keep the project root as this repository root and use:
- Build command: `npm run build`
- Output directory: `dist`

If you still see `404: NOT_FOUND`, it usually means Vercel did not find a built app in the configured output directory (or the wrong root directory was selected).

```bash
# Legacy manual setup (still works)
# With Vite
npm create vite@latest auraboost-web -- --template react
cd auraboost-web
# Replace src/App.jsx with AuraBoost.jsx content
npm install
npm run dev

# With Create React App
npx create-react-app auraboost-web
cd auraboost-web
# Replace src/App.js with AuraBoost.jsx content
npm start
```

> **Note:** The Web Audio API requires a user gesture to initialize the `AudioContext`. The play button tap serves as this gesture. For best results, use Google Chrome or Safari. Firefox has minor Web Audio quirks.

> **Headphones required.** Binaural beats have no effect through speakers — both channels merge into the same air before reaching your ears, cancelling the beat frequency. The app warns users of this.

---

## Audio Architecture

### Signal Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    AUDIO SIGNAL CHAIN                    │
│                                                         │
│  OscL (baseHz) ──► GainL ──┐                           │
│                              ├──► ChannelMerger ──┐    │
│  OscR (base+beat) ► GainR ──┘                     │    │
│                                                    │    │
│  AmbientSource ──► LowPassFilter ──► AmbGain ──┐  │    │
│                                                  │  │    │
│  Subliminal ──► CompressorNode ──► SubGain ──┐  │  │   │
│                                              │  │  │    │
│                                              └──┴──┴──► │
│                                              MasterGain  │
│                                                    │    │
│                                             Destination  │
└─────────────────────────────────────────────────────────┘
```

### Frequency Presets Reference

| Preset | Base Hz | Beat Hz | Band | Ambient |
|---|---|---|---|---|
| Stage King | 200 | 10 | Alpha | Forest |
| Deep Calm | 180 | 4 | Delta/Theta | Ocean |
| Fire Focus | 220 | 14 | Alpha/Beta | Fire |
| Rain Reset | 160 | 6 | Theta | Rain |
| Crown Surge | 210 | 12 | Alpha | Wind |
| Zen Ground | 190 | 7 | Theta | Forest |

### HR-Adaptive Algorithm (Pro)

```
baseline_hr = average of first 60 seconds
spike_threshold = baseline_hr × 1.20

on every 5-second HR update:
  if current_hr > spike_threshold:
    target_beat_hz = current_beat_hz - 0.5  // ramp toward delta
    target_beat_hz = max(target_beat_hz, 4) // floor at 4Hz
    engine.setBinauralFreq(base_hz, target_beat_hz)
  else if current_hr < baseline_hr × 1.05:
    target_beat_hz = current_beat_hz + 0.3  // slowly return to preset
    target_beat_hz = min(target_beat_hz, preset.beatHz)
    engine.setBinauralFreq(base_hz, target_beat_hz)
```

---

## Personalization Engine

AuraBoost uses a lightweight on-device model (no cloud inference calls) built on Firebase ML Kit. The model is a simple weighted scoring function rather than a neural network, keeping it fast, private, and interpretable.

### Input Features

- Anxiety trigger type (from onboarding: crowds, social, performance, general)
- Time of day (morning / afternoon / evening / night)
- Session duration history (avg, trend)
- Mood ratings per preset (exponentially weighted toward recent)
- Ambient type preference (frequency of each type used)
- Beat frequency preference (derived from preset usage patterns)

### Scoring Formula

```dart
double scorePreset(Preset p, UserProfile profile) {
  double score = 0;
  // Mood signal: sessions with this preset rated ≥3 boost score
  score += profile.moodByPreset[p.id]?.weightedAverage ?? 0;
  // Recency: presets used in last 3 days get a boost
  score += profile.lastUsed[p.id] != null
    && DateTime.now().difference(profile.lastUsed[p.id]!).inDays < 3 ? 0.5 : 0;
  // Anxiety fit: crowd anxiety → Stage King / Crown Surge
  if (profile.anxietyTrigger == "crowds" && p.tags.contains("confidence"))
    score += 1.0;
  // Time fit: delta presets recommended at night
  if (DateTime.now().hour >= 21 && p.beatHz < 6)
    score += 0.8;
  return score;
}
```

### Model Update Cycle

The model weights are updated locally after every 5 completed sessions. No data leaves the device unless the user opts into anonymous telemetry (opt-out by default).

---

## Monetization

### Free Tier

- 3 binaural presets (Stage King, Deep Calm, Fire Focus)
- 3 saved custom mixes
- 5-min Emergency Boost
- All solfeggio frequency previews
- Basic mood logging and 3 badges

### Pro ($4.99/year)

- All 6 presets + future additions
- Unlimited saved custom mixes
- HR-adaptive session intensity
- All 4 binaural packs (20+ tracks)
- Premium ambient packs
- Subliminal affirmation customization
- Advanced insights and analytics
- Priority support

### One-Time Packs (future)

Individual ambient packs at $0.99 each for users who want specific add-ons without full Pro.

### Implementation

In-app purchases via `in_app_purchase` package (StoreKit 2 on iOS, Google Play Billing on Android). Entitlement management handled by RevenueCat to normalize across platforms and simplify receipt validation.

```dart
// Check entitlement
final offerings = await Purchases.getOfferings();
final isProUser = (await Purchases.getCustomerInfo())
    .entitlements.active.containsKey('pro');
```

---

## Accessibility

AuraBoost is designed to be fully accessible:

- **Screen reader support:** All interactive elements have semantic labels. `Semantics` widgets wrap custom controls throughout.
- **Large text:** All font sizes use `sp` units, respecting the system accessibility font scale.
- **Color contrast:** Minimum 4.5:1 contrast ratio on all text against backgrounds (WCAG AA compliant).
- **Touch targets:** All tappable elements are minimum 44×44dp, per Apple and Google guidelines.
- **Reduced motion:** Checks `MediaQuery.of(context).disableAnimations` and disables particle effects and aurora animations when enabled.
- **High contrast mode:** Detected via `MediaQuery.of(context).highContrast` — switches to solid fills instead of gradients.
- **No flashing content:** No animations flash more than 3 times per second (WCAG 2.3.1 compliant).

---

## Contributing

Contributions are welcome. Please follow this process:

1. Fork the repository and create a feature branch: `git checkout -b feature/my-feature`
2. Follow the existing code style (Dart: `flutter format .`, React: Prettier with default config)
3. Write or update tests for any changed audio logic
4. Ensure `flutter test` passes with no failures
5. Open a pull request with a clear description of the change and why

### Development Guidelines

- Audio engine changes must be tested on real hardware — emulators do not reproduce audio latency accurately
- All new presets must include a name, emoji, baseHz, beatHz, ambient type, color, tags, and a description string
- New Firebase Firestore schema fields must include a migration path for existing documents
- Do not commit `.env`, `google-services.json`, or `GoogleService-Info.plist`

### Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Be kind, be constructive, be collaborative.

---

## Roadmap

### v1.1
- [ ] User-uploaded custom ambiences (Firebase Storage)
- [ ] Community mix sharing with public/private toggle
- [ ] Apple Watch complication for one-tap Emergency Boost
- [ ] Subliminal affirmation customization (user-typed text, TTS at –30dB)

### v1.2
- [ ] Voice-guided onboarding narration (TTS in detected device language)
- [ ] Session notes / journal entries (text + emoji)
- [ ] Calendar integration: schedule pre-session reminders before calendar events
- [ ] Advanced HR rPPG using camera (no wearable needed for Pro HR adapt)

### v1.3
- [ ] Spatial audio support for AirPods Pro / headphones with head tracking
- [ ] Group session mode: sync beats across multiple devices (partner meditation)
- [ ] AI mix suggestions via on-device Core ML / TFLite model
- [ ] Public API for third-party wearable integrations

### v2.0
- [ ] Live performance coach mode (real-time anxiety monitoring during a session with post-session debrief)
- [ ] Clinician portal for therapists to assign custom protocols
- [ ] Offline AI language model for personalized insight generation

---

## License

```
MIT License

Copyright (c) 2025 AuraBoost

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

**AuraBoost** · Built for the quietly powerful

*The stage is waiting. You are ready.*

</div>
