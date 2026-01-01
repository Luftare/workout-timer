# Volume Feature & Type Refactoring Specification

## Overview

This specification outlines the implementation of:

1. **Volume Multiplier Feature**: Allow users to adjust workout intensity via a volume multiplier (0.1 to 2.0)
2. **Type System Refactoring**: Refactor the `Set` interface to use discriminated unions for better type safety

## Goals

- Enable users to adjust workout difficulty/intensity per workout
- Eliminate code smell of unused `durationSeconds` for rep-based sets
- Improve type safety through discriminated unions
- Maintain backward compatibility during migration

---

## Type System Refactoring

### Current State

```typescript
interface Set {
  id: string;
  name: string;
  durationSeconds: number; // Required but unused for rep sets
  description: string;
  isRest: boolean;
  isTimed: boolean;
}
```

**Problems:**

- `durationSeconds` is mandatory but unused when `isTimed === false`
- Type system doesn't prevent invalid combinations (e.g., `isRest: true, isTimed: false`)
- Reps are stored in `description` string (e.g., "10 reps") instead of structured data

### New Type Structure

Use discriminated unions with a `type` field for type narrowing:

```typescript
interface BaseSet {
  id: string;
  name: string;
}

interface TimedSet extends BaseSet {
  type: "timed";
  durationSeconds: number; // Base duration (before volume adjustment)
  description: string;
}

interface RepSet extends BaseSet {
  type: "reps";
  reps: number; // Base reps value (before volume adjustment)
  description: string;
}

interface Rest {
  type: "rest";
  id: string;
  durationSeconds: number; // Not affected by volume multiplier
}

type Set = TimedSet | RepSet | Rest;
```

### Type Guards

```typescript
function isRepSet(set: Set): set is RepSet {
  return set.type === "reps";
}

function isTimedSet(set: Set): set is TimedSet {
  return set.type === "timed";
}

function isRest(set: Set): set is Rest {
  return set.type === "rest";
}
```

### Workout Interface (Unchanged Structure)

The `Workout` interface structure remains the same - only the `Set` type it references changes:

```typescript
interface Workout {
  id: string;
  name: string;
  description: string;
  sets: Set[]; // Now uses the new discriminated union Set type
}
```

**Note**: Volume is **not** stored in the `Workout` interface. This design allows for flexible volume management:

- Global volume setting for all workouts
- Per-workout volume settings (stored separately)
- Session-only volume (temporary)

---

## Volume Multiplier Feature

### Overview

Volume is a multiplier (0.1 to 2.0) that adjusts workout intensity by scaling:

- **Reps**: `actualReps = Math.max(1, Math.round(reps * volume))`
- **Duration**: `actualDuration = Math.max(3, Math.round(duration * volume))`
- **Rest**: Not affected by volume (rest duration remains unchanged)

### Volume Application

Volume is applied **at runtime** via helper functions, not stored in the set data. This approach:

- Preserves original workout data
- Allows easy volume changes without data transformation
- Keeps data immutable

### Helper Functions

```typescript
/**
 * Get actual reps after applying volume multiplier
 * @param set - RepSet with base reps value
 * @param volume - Volume multiplier (0.25 to 1.25 from commitment levels)
 * @returns Actual reps to perform (minimum 1)
 */
function getActualReps(set: RepSet, volume: number): number {
  return Math.max(1, Math.round(set.reps * volume));
}

/**
 * Get actual duration after applying volume multiplier
 * @param set - TimedSet with base duration
 * @param volume - Volume multiplier (0.25 to 1.25 from commitment levels)
 * @returns Actual duration in seconds (minimum 3)
 */
function getActualDuration(set: TimedSet, volume: number): number {
  return Math.max(3, Math.round(set.durationSeconds * volume));
}

/**
 * Get duration for rest sets (not affected by volume)
 * @param set - Rest set
 * @returns Duration in seconds
 */
function getRestDuration(set: Rest): number {
  return set.durationSeconds;
}

/**
 * Convert commitment level to volume multiplier
 * @param level - Commitment level string
 * @returns Volume multiplier (0.25 to 1.25)
 */
function getVolumeFromCommitment(level: CommitmentLevel): number {
  return COMMITMENT_LEVELS[level].multiplier;
}
```

### Volume Constraints

- **Discrete Levels**: Five commitment-based levels (see Commitment Ladder below)
- **Range**: 0.25 to 1.25 (25% to 125%)
- **Default**: 1.0 (100% - "Standard")
- **Storage**: Managed separately from `Workout` interface (see Volume Persistence section)

### Commitment-Based Ladder

The volume control uses a **Commitment-based ladder** instead of a continuous slider. This translates the underlying volume multiplier into intuitive, intention-based choices that encourage consistency and gradual progression.

**Design Philosophy:**

- Emphasizes showing up and completing workouts over maximizing effort
- Discrete levels avoid rounding ambiguity
- Beginner-safe while still nudging long-term progression
- Changes are reflected immediately in reps and hold durations

**Commitment Levels:**

| Level       | Multiplier | Percentage | Description                        |
| ----------- | ---------- | ---------- | ---------------------------------- |
| Try it      | 0.25       | 25%        | Minimal commitment, just show up   |
| Easy win    | 0.50       | 50%        | Reduced effort, build consistency  |
| Comfortable | 0.75       | 75%        | Moderate effort, sustainable pace  |
| Standard    | 1.00       | 100%       | Full workout as designed (default) |
| Push it     | 1.25       | 125%       | Increased intensity, progression   |

**Constants Definition:**

```typescript
// In constants.ts or dedicated commitment file
export type CommitmentLevel =
  | "try-it"
  | "easy-win"
  | "comfortable"
  | "standard"
  | "push-it";

export const COMMITMENT_LEVELS: Record<
  CommitmentLevel,
  { label: string; multiplier: number; percentage: number }
> = {
  "try-it": { label: "Try it", multiplier: 0.25, percentage: 25 },
  "easy-win": { label: "Easy win", multiplier: 0.5, percentage: 50 },
  comfortable: { label: "Comfortable", multiplier: 0.75, percentage: 75 },
  standard: { label: "Standard", multiplier: 1.0, percentage: 100 },
  "push-it": { label: "Push it", multiplier: 1.25, percentage: 125 },
};

export const DEFAULT_COMMITMENT_LEVEL: CommitmentLevel = "standard";

// localStorage key constants
export const COMMITMENT_STORAGE_KEY_PREFIX = "workout-";
export const COMMITMENT_STORAGE_KEY_SUFFIX = "-commitment";

/**
 * Get localStorage key for a workout's commitment level
 * @param workoutId - The workout ID
 * @returns localStorage key string
 */
export function getCommitmentStorageKey(workoutId: string): string {
  return `${COMMITMENT_STORAGE_KEY_PREFIX}${workoutId}${COMMITMENT_STORAGE_KEY_SUFFIX}`;
}
```

**Implementation:**

- Label: "Workout Commitment"
- UI: Radio buttons or button group with five discrete options
- Location: `WorkoutDetailView` component, above the sets list
- Immediate feedback: Sets display updated reps/durations as selection changes

---

## Data Migration

### Migration Strategy

Existing workouts need to be migrated from the old format to the new format:

1. **Extract reps from description**: Parse "10 reps" → `reps: 10`
2. **Convert to discriminated union**: Use `type` field instead of boolean flags
3. **Simplify rest sets**: Remove unnecessary fields

**Note**: Volume is not part of the workout data structure, so no volume migration is needed.

### Migration Function

```typescript
/**
 * Migrates old Set format to new discriminated union format
 */
function migrateSet(oldSet: OldSet): Set {
  if (oldSet.isRest) {
    return {
      type: "rest",
      id: oldSet.id,
      durationSeconds: oldSet.durationSeconds,
    };
  }

  if (oldSet.isTimed) {
    return {
      type: "timed",
      id: oldSet.id,
      name: oldSet.name,
      durationSeconds: oldSet.durationSeconds,
      description: oldSet.description,
    };
  }

  // Rep-based set: extract reps from description
  const repsMatch = oldSet.description.match(/(\d+)\s*reps?/i);
  const reps = repsMatch ? parseInt(repsMatch[1], 10) : 10; // Default to 10 if not found

  return {
    type: "reps",
    id: oldSet.id,
    name: oldSet.name,
    reps: reps,
    description: oldSet.description,
  };
}

/**
 * Migrates old Workout format to new format
 */
function migrateWorkout(oldWorkout: OldWorkout): Workout {
  return {
    id: oldWorkout.id,
    name: oldWorkout.name,
    description: oldWorkout.description,
    sets: oldWorkout.sets.map(migrateSet),
  };
}
```

---

## UI Changes

### Rep Display Format

Rep sets should display as: `{actualReps}x {set.name}`

**Example:**

- Base: `reps: 10, name: "Pushups"`
- Volume: `1.5`
- Display: `"15x Pushups"`

### Volume Control UI - Commitment Ladder

**Location**: `WorkoutDetailView` component, displayed above the sets list

**Implementation:**

The commitment ladder is implemented as a radio button group or button group with five discrete options. Each option represents a commitment level with its associated multiplier.

**Component Structure:**

```typescript
// CommitmentLadder component
interface CommitmentLadderProps {
  selectedLevel: CommitmentLevel;
  onLevelChange: (level: CommitmentLevel) => void;
}

type CommitmentLevel =
  | "try-it"
  | "easy-win"
  | "comfortable"
  | "standard"
  | "push-it";

const COMMITMENT_LEVELS: Record<
  CommitmentLevel,
  { label: string; multiplier: number }
> = {
  "try-it": { label: "Try it", multiplier: 0.25 },
  "easy-win": { label: "Easy win", multiplier: 0.5 },
  comfortable: { label: "Comfortable", multiplier: 0.75 },
  standard: { label: "Standard", multiplier: 1.0 },
  "push-it": { label: "Push it", multiplier: 1.25 },
};
```

**UI Design:**

- Horizontal button group or radio buttons
- Each button shows the commitment level label
- Selected state is clearly indicated
- Default selection: "Standard" (1.00)
- Changes immediately update displayed reps/durations in SetCards below

**Placement in WorkoutDetailView:**

```typescript
<div className="workout-detail">
  <Nav onBack={handleBack} onExit={handleExit} />
  <div className="workout-detail__content">
    {/* Commitment Ladder */}
    <div className="workout-detail__commitment">
      <label>Workout Commitment</label>
      <CommitmentLadder
        selectedLevel={commitmentLevel}
        onLevelChange={handleCommitmentChange}
      />
    </div>

    {/* Sets list with volume-adjusted values */}
    <div className="workout-detail__sets">
      {selectedWorkout.sets.map((set) => (
        <SetCard
          key={set.id}
          set={set}
          volume={getVolumeFromCommitment(commitmentLevel)}
        />
      ))}
    </div>

    <div className="workout-detail__actions">
      <Button onClick={handleStart}>Start</Button>
    </div>
  </div>
</div>
```

**Behavior:**

- Selection persists per workout (stored in localStorage or state)
- When user changes commitment level, all SetCards immediately reflect new reps/durations
- Volume multiplier is passed to SetCard component for display
- Selected commitment level is used when starting the workout

### SetCard Component Updates

```typescript
// Before
<span>{set.isTimed ? formatDuration(set.durationSeconds) : "-"}</span>;

// After
// Note: volume is passed as a prop or retrieved from store/context
{
  isRepSet(set) && <span>{getActualReps(set, volume)}x</span>;
}
{
  isTimedSet(set) && (
    <span>{formatDuration(getActualDuration(set, volume))}</span>
  );
}
{
  isRest(set) && <span>{formatDuration(getRestDuration(set))}</span>;
}
```

### TimerView Updates

- Use `getActualReps()` and `getActualDuration()` when displaying/using set values
- Rest duration uses `getRestDuration()` (no volume applied)
- Timer calculations use actual duration values

---

## Implementation Checklist

### Phase 1: Type System Refactoring

- [ ] Create new type definitions (`TimedSet`, `RepSet`, `Rest`, `Set` union)
- [ ] Create type guard functions
- [ ] Create migration functions for existing data
- [ ] Update `Workout` interface (remove unused fields, keep structure)
- [ ] Migrate `DEFAULT_WORKOUTS` data to new format
- [ ] Update all type references throughout codebase

### Phase 2: Helper Functions

- [ ] Implement `getActualReps()`
- [ ] Implement `getActualDuration()`
- [ ] Implement `getRestDuration()`
- [ ] Implement `getVolumeFromCommitment()` - converts commitment level to multiplier
- [ ] Add unit tests for helper functions

### Phase 3: Store Updates

- [ ] Update `timerStore` to use new `Set` type
- [ ] Add volume state management (global or per-workout)
- [ ] Update timer calculations to use actual duration values
- [ ] Ensure rest duration is not affected by volume

### Phase 4: Component Updates

- [ ] Update `SetCard` component for new type structure
- [ ] Update `TimerView` to use helper functions
- [ ] Update `WorkoutDetailView` to display reps correctly
- [ ] Update `setSequence.ts` to work with new types

### Phase 5: Commitment Ladder UI

- [ ] Create `CommitmentLadder` component with five discrete levels
- [ ] Define commitment level types and constants
- [ ] Add commitment ladder to `WorkoutDetailView` above sets list
- [ ] Implement commitment level selection state management
- [ ] Create helper function to convert commitment level to volume multiplier
- [ ] Create helper function to validate commitment level strings
- [ ] Create helper function to generate localStorage key from workout ID
- [ ] Add localStorage key constants to constants file
- [ ] Implement initialization logic in `WorkoutDetailView`:
  - [ ] Check localStorage for persisted commitment level on mount
  - [ ] Load persisted value if found
  - [ ] Persist default ("standard") if not found
  - [ ] Use workout ID in localStorage key format
- [ ] Update `SetCard` to accept and use volume prop
- [ ] Implement immediate feedback (update SetCards when commitment changes)
- [ ] Persist commitment level changes to localStorage when user selects new level
- [ ] Pass selected commitment level to timer store when starting workout

### Phase 6: Testing

- [ ] Test volume application for all commitment levels (0.25, 0.50, 0.75, 1.00, 1.25)
- [ ] Test edge cases (minimum reps/duration constraints)
- [ ] Test rest sets are unaffected by commitment level
- [ ] Test migration of existing workouts
- [ ] Test immediate UI updates when commitment level changes
- [ ] Test commitment level persistence per workout
- [ ] Test default commitment level (Standard/1.00)
- [ ] Test initialization: Load persisted commitment level from localStorage
- [ ] Test initialization: Persist default when no value exists
- [ ] Test initialization: Handle invalid/corrupted localStorage values
- [ ] Test initialization: Use correct localStorage key format with workout ID

---

## Edge Cases & Considerations

### Minimum Values

- **Reps**: Minimum 1 (even if `reps * volume < 1`)
- **Duration**: Minimum 3 seconds (even if `duration * volume < 3`)

### Rounding

- Use `Math.round()` for both reps and duration
- Example: `10 * 1.15 = 11.5 → 12 reps`

### Rest Sets

- Rest duration is **never** affected by volume
- Rest sets only have `id` and `durationSeconds`
- Rest name can be hardcoded in UI as "Rest"

### Volume Persistence

Commitment level (and its associated volume multiplier) is managed separately from the `Workout` interface to allow flexibility in implementation:

**Options:**

1. **Per workout in localStorage**: `workout-{id}-commitment` (allows different commitment per workout)
2. **Global user preference**: Single commitment level for all workouts (stored as `global-commitment`)
3. **Session-only**: Reset to "standard" on page reload (no persistence)
4. **Hybrid**: Global default with per-workout overrides

**Implementation**:

- Commitment level should be retrieved from storage/state when needed
- Convert commitment level to volume multiplier using `getVolumeFromCommitment()`
- Pass volume multiplier to helper functions
- Default commitment level: "standard" (1.00 multiplier)
- The commitment level is not part of the workout data structure

### Commitment Level Initialization

When `WorkoutDetailView` loads, it initializes the commitment level from localStorage:

**Initialization Flow:**

1. **On component mount** (when workout is selected):
   - Construct localStorage key: `workout-{workoutId}-commitment`
   - Check if a persisted commitment level exists in localStorage for this workout
   - If found: Load the persisted value into component state
   - If not found:
     - Set default commitment level ("standard") in component state
     - Persist the default value to localStorage with the workout-specific key

**Implementation Details:**

```typescript
// In WorkoutDetailView component
useEffect(() => {
  if (!selectedWorkout) return;

  const storageKey = getCommitmentStorageKey(selectedWorkout.id);
  const persistedLevel = localStorage.getItem(storageKey);

  if (persistedLevel && isValidCommitmentLevel(persistedLevel)) {
    // Load persisted value
    setCommitmentLevel(persistedLevel as CommitmentLevel);
  } else {
    // Set and persist default
    const defaultLevel: CommitmentLevel = DEFAULT_COMMITMENT_LEVEL;
    setCommitmentLevel(defaultLevel);
    localStorage.setItem(storageKey, defaultLevel);
  }
}, [selectedWorkout]);
```

**Helper Function:**

```typescript
/**
 * Validates that a string is a valid commitment level
 * @param level - String to validate
 * @returns true if valid commitment level, false otherwise
 */
function isValidCommitmentLevel(level: string): level is CommitmentLevel {
  return Object.keys(COMMITMENT_LEVELS).includes(level);
}
```

**Key Format:**

- Pattern: `workout-{workoutId}-commitment`
- Example: `workout-beginner-calisthenics-commitment`
- Example: `workout-debug-commitment`

**Behavior:**

- Each workout maintains its own commitment level preference
- Default commitment level ("standard") is persisted on first load if no preference exists
- Invalid or corrupted localStorage values fall back to default and are overwritten
- Commitment level persists across page reloads and browser sessions

### Backward Compatibility

- Migration function handles old format
- Default volume of 1.0 maintains existing behavior
- Volume management is independent of workout data structure

---

## Testing Scenarios

### Volume Application Tests

1. **Reps scaling with commitment levels**:

   - `reps: 10, "Try it" (0.25)` → `3 reps` (10 \* 0.25 = 2.5 → 3)
   - `reps: 10, "Easy win" (0.50)` → `5 reps`
   - `reps: 10, "Comfortable" (0.75)` → `8 reps` (10 \* 0.75 = 7.5 → 8)
   - `reps: 10, "Standard" (1.00)` → `10 reps`
   - `reps: 10, "Push it" (1.25)` → `13 reps` (10 \* 1.25 = 12.5 → 13)
   - `reps: 2, "Try it" (0.25)` → `1 rep` (minimum enforced)

2. **Duration scaling with commitment levels**:

   - `duration: 30, "Try it" (0.25)` → `8s` (30 \* 0.25 = 7.5 → 8)
   - `duration: 30, "Easy win" (0.50)` → `15s`
   - `duration: 30, "Comfortable" (0.75)` → `23s` (30 \* 0.75 = 22.5 → 23)
   - `duration: 30, "Standard" (1.00)` → `30s`
   - `duration: 30, "Push it" (1.25)` → `38s` (30 \* 1.25 = 37.5 → 38)
   - `duration: 5, "Try it" (0.25)` → `3s` (minimum enforced)

3. **Rest unaffected**:
   - `rest: 60s, any commitment level` → `60s` (unchanged)

### Type Safety Tests

1. Type guards correctly identify set types
2. TypeScript prevents accessing wrong properties
3. Discriminated unions enable proper type narrowing

### Migration Tests

1. Old format correctly converts to new format
2. Reps extracted correctly from descriptions
3. Default values applied for missing data

### Initialization Tests

1. **Load persisted commitment level**:

   - localStorage contains `workout-{id}-commitment: "push-it"`
   - WorkoutDetailView loads and sets commitment level to "push-it"
   - UI displays "Push it" as selected

2. **Persist default when missing**:

   - localStorage has no entry for `workout-{id}-commitment`
   - WorkoutDetailView loads and sets commitment level to "standard"
   - localStorage is updated with `workout-{id}-commitment: "standard"`

3. **Handle invalid localStorage values**:

   - localStorage contains `workout-{id}-commitment: "invalid-level"`
   - WorkoutDetailView detects invalid value
   - Falls back to "standard" and overwrites invalid value in localStorage

4. **Workout-specific keys**:

   - Different workouts use different localStorage keys
   - `workout-beginner-calisthenics-commitment` vs `workout-debug-commitment`
   - Each workout maintains independent commitment level

5. **Key format validation**:
   - Key format: `workout-{workoutId}-commitment`
   - Works with various workout ID formats (kebab-case, alphanumeric, etc.)

---

## Future Enhancements (Out of Scope)

- Volume presets/templates
- Volume history/analytics
- Per-exercise volume (instead of per-workout)
- Volume recommendations based on performance

---

## Notes

- Commitment level (volume) is **not** stored in the `Workout` interface, allowing flexible implementation
- Commitment level can be managed as global setting, per-workout, or session-only
- All sets in a workout use the same commitment level/volume multiplier
- Rest periods are intentionally excluded from volume adjustment
- Migration is a one-time operation for existing data
- Helper functions accept volume multiplier as a parameter, keeping workout data immutable
- Commitment ladder uses discrete levels (0.25, 0.50, 0.75, 1.00, 1.25) to avoid rounding ambiguity
- Default commitment level is "Standard" (1.00) which maintains existing workout behavior
- The commitment ladder emphasizes consistency and gradual progression over maximizing effort
