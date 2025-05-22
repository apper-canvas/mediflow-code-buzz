import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check user preference or system preference on initial load
    if (localStorage.getItem('darkMode') === 'true') {
      return true;
    } else if (localStorage.getItem('darkMode') === 'false') {
      return false;
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Header with dark mode toggle
  const Header = () => {
    const MoonIcon = getIcon('moon');
    const SunIcon = getIcon('sun');
    const MenuIcon = getIcon('menu');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <header className="sticky top-0 z-50 w-full border-b border-surface-200 dark:border-surface-700 bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary text-white flex items-center justify-center">
              <span className="text-lg font-bold">M</span>
            </div>
            <h1 className="text-xl font-bold">MediFlow</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-4">
              <a href="#dashboard" className="text-surface-700 hover:text-primary dark:text-surface-200 font-medium">Dashboard</a>
              <a href="#patients" className="text-surface-700 hover:text-primary dark:text-surface-200 font-medium">Patients</a>
              <a href="#appointments" className="text-surface-700 hover:text-primary dark:text-surface-200 font-medium">Appointments</a>
            </nav>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-surface-700" />}
            </button>
          </div>
          
          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-surface-700" />}
            </button>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              aria-label="Toggle menu"
            >
              <MenuIcon className="h-5 w-5 text-surface-700 dark:text-surface-200" />
            </button>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700"
            >
              <nav className="container mx-auto px-4 py-3 flex flex-col gap-3">
                <a 
                  href="#dashboard" 
                  className="py-2 px-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </a>
                <a 
                  href="#patients" 
                  className="py-2 px-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Patients
                </a>
                <a 
                  href="#appointments" 
                  className="py-2 px-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Appointments
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    );
  };

  // Footer component
  const Footer = () => {
    const HeartIcon = getIcon('heart');
    
    return (
      <footer className="mt-auto border-t border-surface-200 dark:border-surface-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              © {new Date().getFullYear()} MediFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-surface-600 dark:text-surface-400">
              <span>Made with</span>
              <HeartIcon className="h-4 w-4 text-red-500" />
              <span>for healthcare professionals</span>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="mt-16"
      />
    </div>
  );
}

export default App;