import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import AdminPage from './pages/AdminPage';
import { StationProvider } from './hooks/useStations';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/abpasa" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </StationProvider>
  </React.StrictMode>
);
