import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
      </main>
      <Footer />

      <button
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm shadow-lg hover:bg-gray-700 transition-colors"
      >
        View Admin Dashboard
      </button>
    </div>
  );
}

export default App;
