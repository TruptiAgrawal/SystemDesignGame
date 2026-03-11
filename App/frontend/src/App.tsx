import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './views/LandingPage';
import MissionGallery from './views/MissionGallery';
import ArchitectView from './views/ArchitectView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gallery" element={<MissionGallery />} />
        <Route path="/architect" element={<ArchitectView />} />
      </Routes>
    </Router>
  );
}

export default App;
