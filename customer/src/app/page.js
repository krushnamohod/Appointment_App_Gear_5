'use client';

import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import BookingFlow from './components/BookingFlow';
import ConfirmationPage from './components/ConfirmationPage';
import ProfilePage from './components/ProfilePage';

export default function CustomerApp() {
  const [currentView, setCurrentView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookingData, setBookingData] = useState({});

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onBookAppointment={() => setCurrentView('booking')} />;
      case 'booking':
        return <BookingFlow 
          bookingData={bookingData}
          setBookingData={setBookingData}
          onComplete={() => setCurrentView('confirmation')}
          onCancel={() => setCurrentView('home')}
        />;
      case 'confirmation':
        return <ConfirmationPage 
          bookingData={bookingData}
          onBackToHome={() => setCurrentView('home')}
        />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage onBookAppointment={() => setCurrentView('booking')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <main className="pb-20 md:pb-8">
        {renderView()}
      </main>
    </div>
  );
}