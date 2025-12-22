import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./views/Home/Home";
import { WorkoutDetailView } from "./views/WorkoutDetailView/WorkoutDetailView";
import { TimerView } from "./views/TimerView/TimerView";
import "./styles/index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout-detail" element={<WorkoutDetailView />} />
        <Route path="/timer" element={<TimerView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
