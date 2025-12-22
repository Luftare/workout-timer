# Workout Timer PWA - Implementation TODO

This document outlines the iterative development plan. Each iteration produces a working, testable version of the product with focus on perfecting the UX before moving to the next iteration.

## Iteration 1: Timer Foundation

**Goal**: User can start a timer with a countdown.

**Features**:

- Single hard-coded workout (e.g., "Pushups" for 30 seconds)
- Full-screen activity view
- "Start Countdown" button (pulsating)
- 3-second countdown before timer starts
- Timer displays remaining time (e.g., "0:30")
- Full-height progress bar (background color) animates from left to right
- Timer completes and shows completion state

**Components to Build**:

- Button (with pulsate prop)
- Headline (large size for activity name)
- Paragraph (for description)
- Basic layout structure

**Technical Tasks**:

- [x] Set up React + TypeScript project
- [x] Set up React Router (basic routing)
- [x] Set up Zustand store (basic timer state)
- [x] Create constants.ts (COUNTDOWN_DURATION_MS, etc.)
- [x] Create index.css with CSS variables (lime theme)
- [x] Build Button component with pulsate animation
- [x] Build Headline component (large size)
- [x] Build Paragraph component
- [x] Create timer logic (countdown → timer → completion)
- [x] Implement progress bar animation (full-height background)
- [x] Create single workout timer view
- [x] Style with minimal, spacious design (left-aligned, big bold text)

**Acceptance Criteria**:

- User can tap "Start Countdown" button
- 3-second countdown appears
- Timer starts automatically after countdown
- Progress bar animates smoothly
- Timer shows remaining time
- Timer completes and shows completion state

---

## Iteration 2: Workouts

**Goal**: User can see hard-coded workouts with different timer durations, names and descriptions. Each workout consists of sets.

**Features**:

- Hard-coded workout list with sets (e.g., 30s pushups, 60s rest, 30s pushups)
- Workout detail view with small cards showing:
  - Activity name and duration (top row)
  - Description (below)
- Static "Start" button (always visible)
- Back button (top of page)
- Navigation from workout detail view to timer view
- Step indicator (e.g., "1 of 3") on timer view
- "Next" button after set completes
- Navigate through sets sequentially

**Components to Build**:

- Nav component (with exit button placeholder)
- Set card component
- Workout detail view

**Technical Tasks**:

- [x] Create hard-coded workout data structure
- [x] Build WorkoutDetailView view component
- [x] Build set card component
- [x] Add Nav component (basic structure)
- [x] Implement routing: WorkoutDetailView → TimerView
- [x] Add step indicator to timer view
- [x] Implement "Next" button logic
- [x] Track current set index in Zustand
- [x] Handle last set (show "Finish" instead of "Next")
- [x] Add back button to workout detail view
- [x] Style set cards (minimal, spacious)

**Acceptance Criteria**:

- User sees list of workouts with sets (names, durations, descriptions)
- User can scroll through sets
- User can tap "Start" to begin workout
- Timer view shows current set with step indicator
- After timer completes, "Set Completed" message and "Next" button appears
- User can progress through all sets
- Last set shows "Finish" button

---

## Iteration 3: Multiple Workouts

**Goal**: Home screen with workout selections.

**Features**:

- Home screen with workout cards
- Each card shows: workout name, description, "Select" button
- Navigation: Home → Workout Detail → Timer View
- Exit button in Nav (returns to home)
- Multiple hard-coded workouts

**Components to Build**:

- Workout card component
- Home view component
- Complete Nav component (with exit functionality)

**Technical Tasks**:

- [x] Create hard-coded workout data structure
- [x] Build Home view component
- [x] Build workout card component
- [x] Complete Nav component with exit button
- [x] Implement routing: Home → WorkoutDetailView → TimerView
- [x] Add exit button functionality (navigate to home)
- [x] Update Zustand store for workout selection
- [x] Style home screen (cards, spacing, lime theme)
- [x] Ensure Nav is always visible

**Acceptance Criteria**:

- User sees home screen with workout cards
- User can tap "Select" to choose a workout
- User navigates to workout detail view for selected workout
- Exit button returns to home from any view
- Nav bar is always visible

---

## Iteration 4: PWA Setup

**Goal**: Make app installable as PWA.

**Technical Tasks**:

- [ ] Create manifest.json
- [ ] Add service worker
- [ ] Configure PWA settings
- [ ] Test installation on mobile devices
- [ ] Ensure full-screen experience
- [ ] Add app icons

---

## Iteration 5: Audio & Polish

**Goal**: Audio feedback and visual polish.

**Features**:

- High-pitch beep when countdown starts (Web Audio API)
- Beep sound when timer completes
- Confetti animation on workout completion screen

**Technical Tasks**:

- [ ] Implement Web Audio API beep function, initiate the audio engine upon selecting a workout
- [ ] Add high-pitch beep (150ms) when countdown starts
- [ ] Add lower and a bit longer (500ms) beep when timer completes
- [ ] Integrate confetti library
- [ ] Confetti animation on completion screen
- [ ] Ensure audio works on mobile devices
- [ ] Test audio volume and pitch

**Acceptance Criteria**:

- High-pitch beep plays when countdown starts
- Beep plays when timer completes
- Confetti animates beautifully on workout completion
- Audio works on mobile devices

---

## Iteration 6: Workout Management

**Goal**: Create and edit workouts, persist in localStorage.

**Features**:

- Create new workout functionality
- Edit existing workouts
- Delete workouts
- Workouts persisted in localStorage
- Workout editor/form interface
- Add/remove sets from workouts
- Edit set details (name, duration, description)

**Components to Build**:

- Workout editor component
- Set editor component
- Form components

**Technical Tasks**:

- [ ] Create workout editor view
- [ ] Create set editor component
- [ ] Implement "Create Workout" flow
- [ ] Implement "Edit Workout" flow
- [ ] Add delete workout functionality
- [ ] Implement localStorage persistence for workouts
- [ ] Add form validation
- [ ] Style editor forms (consistent with app design)
- [ ] Add "Edit" button/action on workout cards
- [ ] Handle workout data structure updates
- [ ] Ensure localStorage data integrity

**Acceptance Criteria**:

- User can create new workouts
- User can edit existing workouts
- User can delete workouts
- Workouts are saved to localStorage
- Workouts persist across app sessions
- User can add/remove sets from workouts
- User can edit set details

---

## Notes

- Each iteration should be fully functional and testable
- Focus on perfecting UX in each iteration before moving forward
- Get feedback after each iteration
- No magic numbers - use constants.ts
- Use CSS variables from index.css
- Component-specific CSS files only
