# Workout Timer PWA - Implementation TODO

This document outlines the iterative development plan. Each iteration produces a working, testable version of the product with focus on perfecting the UX before moving to the next iteration.

## Iteration 1: Timer Foundation

**Goal**: User can start a timer with a countdown.

**Features**:

- Single hard-coded exercise (e.g., "Pushups" for 30 seconds)
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
- [x] Create index.css with CSS variables (orange theme)
- [x] Build Button component with pulsate animation
- [x] Build Headline component (large size)
- [x] Build Paragraph component
- [x] Create timer logic (countdown → timer → completion)
- [x] Implement progress bar animation (full-height background)
- [x] Create single exercise timer view
- [x] Style with minimal, spacious design (left-aligned, big bold text)

**Acceptance Criteria**:

- User can tap "Start Countdown" button
- 3-second countdown appears
- Timer starts automatically after countdown
- Progress bar animates smoothly
- Timer shows remaining time
- Timer completes and shows completion state

---

## Iteration 2: Exercises

**Goal**: User can see hard-coded exercises with different timer durations, names and descriptions. Each exercise consists of sets.

**Features**:

- Hard-coded exercise list with sets (e.g., 30s pushups, 60s rest, 30s pushups)
- Exercise list view with small cards showing:
  - Activity name and duration (top row)
  - Description (below)
- Static "Start" button (always visible)
- Back button (top of page)
- Navigation from exercise list to timer view
- Step indicator (e.g., "1 of 3") on timer view
- "Next" button after set completes
- Navigate through sets sequentially

**Components to Build**:

- Nav component (with exit button placeholder)
- Exercise card component
- Exercise list view

**Technical Tasks**:

- [x] Create hard-coded exercise data structure
- [x] Build ExerciseList view component
- [x] Build exercise card component
- [x] Add Nav component (basic structure)
- [x] Implement routing: ExerciseList → TimerView
- [x] Add step indicator to timer view
- [x] Implement "Next" button logic
- [x] Track current exercise index in Zustand
- [x] Handle last exercise (show "Finish" instead of "Next")
- [x] Add back button to exercise list
- [x] Style exercise cards (minimal, spacious)

**Acceptance Criteria**:

- User sees list of exercises with sets (names, durations, descriptions)
- User can scroll through exercises
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
- Navigation: Home → Exercise List → Timer View
- Exit button in Nav (returns to home)
- Multiple hard-coded workouts

**Components to Build**:

- Workout card component
- Home view component
- Complete Nav component (with exit functionality)

**Technical Tasks**:

- [ ] Create hard-coded workout data structure
- [ ] Build Home view component
- [ ] Build workout card component
- [ ] Complete Nav component with exit button
- [ ] Implement routing: Home → ExerciseList → TimerView
- [ ] Add exit button functionality (navigate to home)
- [ ] Update Zustand store for workout selection
- [ ] Style home screen (cards, spacing, orange theme)
- [ ] Ensure Nav is always visible

**Acceptance Criteria**:

- User sees home screen with workout cards
- User can tap "Select" to choose a workout
- User navigates to exercise list for selected workout
- Exit button returns to home from any view
- Nav bar is always visible

---

## Iteration 4: Navigation & State Management

**Goal**: Full navigation flow with skip, backward, pause/continue.

**Features**:

- Pause/Continue functionality during timer
- Skip forward/backward between sets
- Backward navigation from timer to exercise list
- Completion screen with "Awesome!" message
- "Close" button on completion screen returns to home
- Proper state management for all navigation flows

**Components to Build**:

- Completion screen component
- Enhanced timer controls

**Technical Tasks**:

- [ ] Implement pause/continue logic in timer
- [ ] Add "Pause" button during timer
- [ ] Add "Continue" button (pulsating) when paused
- [ ] Implement skip forward/backward functionality
- [ ] Add navigation controls to timer view (skip buttons)
- [ ] Build completion screen component
- [ ] Add confetti animation (basic implementation)
- [ ] Implement "Finish" button → completion screen
- [ ] Add "Close" button on completion screen
- [ ] Handle backward navigation from timer to exercise list
- [ ] Update Zustand store for all navigation states
- [ ] Ensure smooth state transitions

**Acceptance Criteria**:

- User can pause timer during set
- User can continue paused timer
- User can skip to next/previous set
- User can go back from timer to exercise list
- Completion screen appears after last set
- User can return to home from completion screen
- All navigation flows work smoothly

---

## Iteration 5: Audio & Polish

**Goal**: Audio feedback and visual polish.

**Features**:

- High-pitch beep when countdown starts (Web Audio API)
- Beep sound when timer completes
- Confetti animation on completion screen (full implementation)
- Refined animations and transitions
- Pulsating button animations perfected
- Progress bar animation refined

**Technical Tasks**:

- [ ] Implement Web Audio API beep function
- [ ] Add high-pitch beep when countdown starts
- [ ] Add beep when timer completes
- [ ] Integrate confetti library
- [ ] Refine confetti animation on completion screen
- [ ] Polish pulsating button animation
- [ ] Refine progress bar animation smoothness
- [ ] Add smooth transitions between states
- [ ] Ensure audio works on mobile devices
- [ ] Test audio volume and pitch

**Acceptance Criteria**:

- High-pitch beep plays when countdown starts
- Beep plays when timer completes
- Confetti animates beautifully on completion
- All animations are smooth and polished
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
- Add/remove sets from exercises in workouts
- Edit set details (name, duration, description)

**Components to Build**:

- Workout editor component
- Exercise editor component
- Form components

**Technical Tasks**:

- [ ] Create workout editor view
- [ ] Create exercise editor component
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
- User can add/remove sets from exercises in workouts
- User can edit set details

---

## Post-Iteration: PWA Setup

**Goal**: Make app installable as PWA.

**Technical Tasks**:

- [ ] Create manifest.json
- [ ] Add service worker
- [ ] Configure PWA settings
- [ ] Test installation on mobile devices
- [ ] Ensure full-screen experience
- [ ] Add app icons

---

## Notes

- Each iteration should be fully functional and testable
- Focus on perfecting UX in each iteration before moving forward
- Get feedback after each iteration
- Follow coding style rules from `.cursorrules`
- No magic numbers - use constants.ts
- Use CSS variables from index.css
- Component-specific CSS files only
