import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';

function App() {
  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor/:docId" element={<Editor />} />
      </Routes>
    </div>
  );
}

export default App;
