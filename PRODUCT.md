# Workout Timer PWA - Product Specification

## Overview

A Progressive Web App (PWA) designed for mobile morning exercises. The app provides a full-screen workout timer experience that eliminates common issues with traditional timers by providing a countdown before each exercise starts and clear visual/audio feedback.

## Core Problem

Traditional timers often:

- Require stopping beeping manually (unnecessary interruption)
- Start immediately without giving time to prepare
- Don't provide clear visual feedback during exercises
- Don't help guiding the workout

## Solution

A PWA that provides:

- Pre-exercise countdown (3 seconds) to allow preparation
- Full-screen activity display with clear visual feedback
- Automatic progression through exercises
- Audio feedback (beep sounds) for exercise start and end

## Design

- Left-alignment
- Minimal, non-distracting style, simplicity
- Strong nudge towards the success path (=start excercise)
- Native app feel
- Brand references: Adidas, Nike
- Color: Lime, Yellow, Black
- Big bold texts
- Lots of air and spaciousness

## User Flows

### 1. Home Screen (Workout Selection)

- **Layout**: Full-screen PWA view
- **Content**: List of workout cards
- **Card Structure**:
  - Workout name (headline)
  - Description (paragraph)
  - "Select" button (CTA)
- **Actions**:
  - Tap "Select" to choose a workout
  - Can edit existing workouts
  - Can create new workouts

### 2. Exercise List View

- **Layout**: List of exercise items displayed as small cards
- **Card Structure** (per exercise):
  - Activity name and duration (top row)
  - Description (below)
- **Navigation**:
  - Static "Start" button (always visible, can tap while scrolling)
  - Back button (top of page)
  - Exit button (top nav bar, returns to home)
- **Actions**:
  - Tap "Start" to begin the workout
  - Can scroll through exercises before starting
  - Can go back to workout selection

### 3. Activity Timer View (Full Screen)

- **Layout**: Full-screen card with centered content
- **Content**:
  - Large activity name (centered, big text)
  - Description below activity name
  - Step indicator (e.g., "3 of 10") - top area
  - Exit button (top nav bar)
- **States**:

  **a) Pre-Countdown State:**

  - "Start Countdown" button (pulsating, inviting)
  - Shows activity name and description

  **b) Countdown State:**

  - 3-second countdown displayed
  - High-pitch beep sound plays once when countdown starts
  - Progress bar appears at bottom (full-height background color)

  **c) Timer Running State:**

  - Timer displays remaining time (e.g., "2:30")
  - Full-height progress bar (background color) animates from left to right
  - "Pause" button available
  - Can pause and continue

  **d) Paused State:**

  - "Continue" button (pulsating, inviting)
  - Timer and progress bar remain visible but frozen

  **e) Set Complete State:**

  - Beep sound plays when timer finishes
  - "Set Completed" message displayed
  - "Next" button (for intermediate sets)
  - "Finish" button (for last set)
  - Can skip forward or go backward to previous sets

### 4. Completion Screen

- **Layout**: Full-screen
- **Content**:
  - "Awesome!" message (headline)
  - Confetti animation
  - "Close" button (returns to home screen)

## Navigation Structure

- **Top Nav Bar**: Always visible
  - Exit button (top left) - returns to home
  - Centered content (step indicator, etc.)
- **Back Button**: Available on exercise list view

## Design System

### Colors

- **Primary**: Energetic lime (solid color throughout)
- **Background**: White space for separation
- **Progress Bar**: Full-height background color that animates from left to right

### Layout Principles

- Proximity-based visual grouping (no container borders)
- Top area dedicated for header/nav (centered items)
- White space separates sections
- Minimal, clean design

### Interactive Elements

- **Pulsating Buttons**: "Start Countdown" and "Continue" buttons pulse to invite interaction
- **Buttons**: Consistent styling across all CTAs

## Data Management

### Workouts

- Stored in localStorage
- Can be edited
- Can be created new
- Structure:
  - Name
  - Description
  - List of exercises, where each exercise consists of sets (each set with name, duration, description)

## Technical Requirements

### Technology Stack

- **Framework**: React with TypeScript
- **Routing**: React Router
- **State Management**: Zustand
- **Audio**: Web Audio API for beep sounds
- **Animation**: Confetti library for completion screen

### Architecture

- Component-based architecture
- Small, reusable components
- HOCs (Higher Order Components) for state management
- CSS variables in `index.css`
- Component-specific CSS files (e.g., `Button.css`)
- Constants file (`constants.ts`) for all magic numbers

### Required Components

1. **Button**
   - Props: `pulsate` (boolean) - conditionally makes button pulsate
   - Styling: Pulsating animation for "Start Countdown" and "Continue"
2. **Headline**
   - Two sizes (large and medium)
   - Used for activity names, workout names, etc.
3. **Paragraph**
   - Used for descriptions
4. **Nav**
   - Top navigation bar
   - Contains exit button and centered content

### Code Organization

- No magic numbers - all numbers assigned to descriptive variables
- Constants in `constants.ts` for app-wide values
- CSS variables in `index.css` for theming
- Each component has its own CSS file
- Prefer CSS files over inline styles

## Audio Feedback

- **Set Start**: High-pitch beep once when countdown begins
- **Set End**: Beep sound when timer completes
- Implementation: Web Audio API

## User Interactions

### Exercise Navigation

- **Forward**: "Next" button after set completes
- **Backward**: Can go back to previous sets
- **Skip**: Can skip sets (forward or backward)
- **Finish**: After last set, shows "Finish" button

### Timer Controls

- **Start**: Begin countdown (3 seconds)
- **Pause**: Pause timer during set
- **Continue**: Resume paused timer
- **Next/Finish**: Move to next set or complete workout

## Edge Cases

- Background state: Timer continues (or pauses based on implementation)
- Last set: Shows "Finish" instead of "Next"
- First set: Can still go backward (returns to exercise list or stays on first)

## Success Metrics

- Smooth, uninterrupted workout flow
- Clear visual and audio feedback
- No need to manually stop beeping
- Easy navigation between sets
