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
 * @param volume - Volume multiplier (0.1 to 2.0)
 * @returns Actual reps to perform (minimum 1)
 */
function getActualReps(set: RepSet, volume: number): number {
  return Math.max(1, Math.round(set.reps * volume));
}

/**
 * Get actual duration after applying volume multiplier
 * @param set - TimedSet with base duration
 * @param volume - Volume multiplier (0.1 to 2.0)
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
```

### Volume Constraints

- **Range**: 0.1 to 2.0
- **Default**: 1.0 (no adjustment)
- **Precision**: Display with 1 decimal place (e.g., 1.5, 0.8)
- **Storage**: Managed separately from `Workout` interface (see Volume Persistence section)

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

### Volume Control UI

**Location**: Workout detail view (before starting workout)

**Design Options:**

1. **Slider**: Range slider from 0.1 to 2.0 with step 0.1
2. **Input field**: Number input with min/max validation
3. **Preset buttons**: Quick presets (0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x)

**Recommendation**: Slider with value display (e.g., "1.5x")

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

### Phase 5: Volume UI

- [ ] Add volume control to `WorkoutDetailView`
- [ ] Implement volume slider/input component
- [ ] Persist volume per workout (localStorage or state management)
- [ ] Display volume-adjusted values in workout preview

### Phase 6: Testing

- [ ] Test volume application (0.1, 1.0, 2.0)
- [ ] Test edge cases (minimum reps/duration constraints)
- [ ] Test rest sets are unaffected
- [ ] Test migration of existing workouts
- [ ] Test UI updates with volume changes

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

Volume is managed separately from the `Workout` interface to allow flexibility in implementation:

**Options:**

1. **Per workout in localStorage**: `workout-{id}-volume` (allows different volume per workout)
2. **Global user preference**: Single volume for all workouts (stored as `global-volume`)
3. **Session-only**: Reset to 1.0 on page reload (no persistence)
4. **Hybrid**: Global default with per-workout overrides

**Implementation**: Volume should be retrieved from storage/state when needed and passed to helper functions. The volume value is not part of the workout data structure.

### Backward Compatibility

- Migration function handles old format
- Default volume of 1.0 maintains existing behavior
- Volume management is independent of workout data structure

---

## Testing Scenarios

### Volume Application Tests

1. **Reps scaling**:

   - `reps: 10, volume: 1.0` → `10 reps`
   - `reps: 10, volume: 1.5` → `15 reps`
   - `reps: 10, volume: 0.5` → `5 reps`
   - `reps: 10, volume: 0.05` → `1 rep` (minimum)

2. **Duration scaling**:

   - `duration: 30, volume: 1.0` → `30s`
   - `duration: 30, volume: 1.5` → `45s`
   - `duration: 30, volume: 0.5` → `15s`
   - `duration: 5, volume: 0.5` → `3s` (minimum)

3. **Rest unaffected**:
   - `rest: 60s, volume: 2.0` → `60s` (unchanged)

### Type Safety Tests

1. Type guards correctly identify set types
2. TypeScript prevents accessing wrong properties
3. Discriminated unions enable proper type narrowing

### Migration Tests

1. Old format correctly converts to new format
2. Reps extracted correctly from descriptions
3. Default values applied for missing data

---

## Future Enhancements (Out of Scope)

- Volume presets/templates
- Volume history/analytics
- Per-exercise volume (instead of per-workout)
- Volume recommendations based on performance

---

## Notes

- Volume is **not** stored in the `Workout` interface, allowing flexible implementation
- Volume can be managed as global setting, per-workout, or session-only
- All sets in a workout use the same volume multiplier (when volume is applied)
- Rest periods are intentionally excluded from volume adjustment
- Migration is a one-time operation for existing data
- Helper functions accept volume as a parameter, keeping workout data immutable
