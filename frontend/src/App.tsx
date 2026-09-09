import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './store';
import { Navbar, Footer, Toast, EmergencyFab } from './components/layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Artisans from './pages/Artisans';
import ArtisanDetail from './pages/ArtisanDetail';
import Booking from './pages/Booking';
import Jobs from './pages/Jobs';
import { HowItWorks, Join, Support } from './pages/Info';
import Admin from './pages/Admin';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/artisans" element={<Artisans />} />
            <Route path="/artisan/:id" element={<ArtisanDetail />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/join" element={<Join />} />
            <Route path="/support" element={<Support />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Footer />
          <EmergencyFab />
          <Toast />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}
