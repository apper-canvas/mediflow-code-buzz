import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';

export const AuthContext = createContext(null);

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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
            // User is authenticated
            if (redirectPath) {
                navigate(redirectPath);
            } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                    navigate(currentPath);
                } else {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
            // Store user information in Redux
            dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
            // User is not authenticated
            if (!isAuthPage) {
                navigate(
                    currentPath.includes('/signup')
                     ? `/signup?redirect=${currentPath}`
                     : currentPath.includes('/login')
                     ? `/login?redirect=${currentPath}`
                     : '/login');
            } else if (redirectPath) {
                if (
                    ![
                        'error',
                        'signup',
                        'login',
                        'callback'
                    ].some((path) => currentPath.includes(path)))
                    navigate(`/login?redirect=${redirectPath}`);
                else {
                    navigate(currentPath);
                }
            } else if (isAuthPage) {
                navigate(currentPath);
            } else {
                navigate('/login');
            }
            dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        setIsInitialized(true);
      }
    });
  }, [navigate, dispatch]);
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    isAuthenticated,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.success("Logged out successfully");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed: " + error.message);
      }
    }
  };
  
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

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">Initializing application...</div>;
  }
  
  // Header with dark mode toggle
  const Header = () => {
    const MoonIcon = getIcon('moon');
    const SunIcon = getIcon('sun');
    const MenuIcon = getIcon('menu');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
      if (authMethods.isAuthenticated) {
        authMethods.logout();
      } else {
        navigate('/login');
      }
    };

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
              {isAuthenticated && (
                <>
                  <a href="#patients" className="text-surface-700 hover:text-primary dark:text-surface-200 font-medium">Patients</a>
                  <a href="#appointments" className="text-surface-700 hover:text-primary dark:text-surface-200 font-medium">Appointments</a>
                </>
              )}
            </nav>

            <button
              onClick={handleLogout}
              className="text-surface-700 hover:text-primary dark:text-surface-200 font-medium">
              {isAuthenticated ? 'Logout' : 'Login'}
            </button>
            
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
                {isAuthenticated && (
                  <>
                    <a 
                      href="#patients" 
                      className="py-2 px-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Patients
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
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700">
                  {isAuthenticated ? 'Logout' : 'Login'}
                </button>
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
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen flex flex-col">
        {isAuthenticated && <Header />}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        {isAuthenticated && <Footer />}
        
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
    </AuthContext.Provider>
  );
}

export default App;