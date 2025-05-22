import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const AlertTriangleIcon = getIcon('alert-triangle');
  const HomeIcon = getIcon('home');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center"
    >
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="h-24 w-24 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
          <AlertTriangleIcon className="h-12 w-12" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-sm">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link to="/" className="btn btn-primary flex items-center gap-2">
          <HomeIcon className="h-5 w-5" />
          <span>Go back home</span>
        </Link>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
        className="mt-12 p-6 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-100/50 dark:bg-surface-800/50 max-w-xl"
      >
        <h3 className="font-semibold mb-2">Need Help?</h3>
        <p className="text-sm text-surface-600 dark:text-surface-400">
          If you're having trouble finding what you need, contact our support team for assistance.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;