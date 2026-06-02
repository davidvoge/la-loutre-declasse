import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExposantsPage from './components/ExposantsPage';
import PhotocopieSite from './components/PhotocopieSite';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PhotocopieSite />} />
        <Route path="/exposants" element={<ExposantsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
