import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./views/Home/Home";
import { ExerciseList } from "./views/ExerciseList/ExerciseList";
import { TimerView } from "./views/TimerView/TimerView";
import "./styles/index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercises" element={<ExerciseList />} />
        <Route path="/timer" element={<TimerView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
