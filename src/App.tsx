import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { ImpactPage } from './pages/ImpactPage';
import { FleetPage } from './pages/FleetPage';
import { PitchPage } from './pages/PitchPage';

export function App() {
  return (
    <SimulationProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-[#FFFFFF] selection:bg-[#E4002B] selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/digital-twin" element={<DigitalTwinPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/fleet" element={<FleetPage />} />
              <Route path="/pitch" element={<PitchPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </SimulationProvider>
  );
}

export default App;
