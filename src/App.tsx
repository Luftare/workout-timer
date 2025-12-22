import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TimerView } from './views/TimerView/TimerView';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TimerView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

