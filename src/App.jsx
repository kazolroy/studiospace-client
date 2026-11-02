import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import { Spinner } from './components/ui';

const Home = lazy(() => import('./pages/Home'));
const Studios = lazy(() => import('./pages/Studios'));
const StudioDetails = lazy(() => import('./pages/StudioDetails'));
const AddStudio = lazy(() => import('./pages/AddStudio'));
const EditStudio = lazy(() => import('./pages/EditStudio'));
const MyListings = lazy(() => import('./pages/MyListings'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const priv = (el) => <PrivateRoute>{el}</PrivateRoute>;

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<Spinner label="Loading" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/studios" element={<Studios />} />
            <Route path="/studios/edit/:id" element={priv(<EditStudio />)} />
            <Route path="/studios/:id" element={<StudioDetails />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-studio" element={priv(<AddStudio />)} />
            <Route path="/my-listings" element={priv(<MyListings />)} />
            <Route path="/my-bookings" element={priv(<MyBookings />)} />
            <Route path="/dashboard" element={priv(<Dashboard />)} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
