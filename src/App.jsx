import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MerciPage from './components/MerciPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MerciPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
