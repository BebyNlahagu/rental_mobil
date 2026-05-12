import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { initializeUsers } from './lib/auth';
import { Home } from './pages/Home';
import { Cars } from './pages/Cars';
import { CarDetail } from './pages/CarDetail';
import { Booking } from './pages/Booking';
import { Payment } from './pages/Payment';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { MyBookings } from './pages/MyBookings';
import { Scan } from './pages/Scan';
import { HowItWorks } from './pages/HowItWorks';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';
import { BlogDetail } from './pages/BlogDetail';
import { Daily } from './pages/Daily';
import { Monthly } from './pages/Monthly';
import { Services } from './pages/Services';
import { Driver } from './pages/Driver';
import { AirportTransfer } from './pages/AirportTransfer';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthCallback } from './pages/AuthCallback';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ManageCars } from './pages/admin/ManageCars';
import { ManageBookings } from './pages/admin/ManageBookings';
import { ManagePayments } from './pages/admin/ManagePayments';
import { ManageBlogs } from './pages/admin/ManageBlogs';
import { Users } from './pages/admin/Users';
import { Settings } from './pages/admin/Settings';

function App() {
  useEffect(() => {
    initializeUsers();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes - No Navbar/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="cars" element={<ManageCars />} />
          <Route path="blogs" element={<ManageBlogs />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="payments" element={<ManagePayments />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Public Routes */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/daily" element={<Daily />} />
                  <Route path="/cars" element={<Cars />} />
                  <Route path="/cars/:id" element={<CarDetail />} />
                  <Route path="/monthly" element={<Monthly />} />
                  <Route path="/driver" element={<Driver />} />
                  <Route path="/airport" element={<AirportTransfer />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route 
                    path="/booking" 
                    element={
                      <ProtectedRoute>
                        <Booking />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/payment" 
                    element={
                      <ProtectedRoute>
                        <Payment />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/booking-confirmation" 
                    element={
                      <ProtectedRoute>
                        <BookingConfirmation />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/my-bookings" 
                    element={
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route
                    path="/scan"
                    element={
                      <ProtectedRoute requireAdmin>
                        <Scan />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
