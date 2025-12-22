import { useNavigate } from "react-router-dom";
import { DEFAULT_WORKOUTS } from "../../data/workouts";
import { WorkoutCard } from "../../components/WorkoutCard/WorkoutCard";
import { useTimerStore } from "../../store/timerStore";
import "./Home.css";

export const Home = () => {
  const navigate = useNavigate();
  const setSelectedWorkout = useTimerStore((state) => state.setSelectedWorkout);

  const handleSelectWorkout = (workoutId: string) => {
    const workout = DEFAULT_WORKOUTS.find((w) => w.id === workoutId);
    if (workout) {
      setSelectedWorkout(workout);
      navigate("/exercises");
    }
  };

  return (
    <div className="home">
      <div className="home__content">
        <div className="home__workouts">
          {DEFAULT_WORKOUTS.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onSelect={() => handleSelectWorkout(workout.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

