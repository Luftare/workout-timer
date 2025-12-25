import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./views/Home/Home";
import { WorkoutDetailView } from "./views/WorkoutDetailView/WorkoutDetailView";
import { TimerView } from "./views/TimerView/TimerView";
import {
  checkForServiceWorkerUpdate,
  setupUpdateCheckOnVisibility,
} from "./utils/serviceWorkerUpdate";
import "./styles/index.css";

function App() {
  useEffect(() => {
    // Check for updates on app load
    checkForServiceWorkerUpdate();

    // Set up update checks when app becomes visible
    const cleanup = setupUpdateCheckOnVisibility();

    return cleanup;
  }, []);

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
