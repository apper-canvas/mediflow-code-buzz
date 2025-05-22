import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  // Icons
  const UserPlusIcon = getIcon('user-plus');
  const CalendarIcon = getIcon('calendar');
  const FileTextIcon = getIcon('file-text');
  const BarChart2Icon = getIcon('bar-chart-2');
  const ActivityIcon = getIcon('activity');
  const BellIcon = getIcon('bell');

  // State for stats
  const [stats] = useState([
    { id: 1, name: 'Total Patients', value: '1,243', change: '+12%', icon: 'user-plus', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    { id: 2, name: 'Today\'s Appointments', value: '28', change: '+3', icon: 'calendar', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    { id: 3, name: 'Pending Reports', value: '14', change: '-5', icon: 'file-text', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
    { id: 4, name: 'Revenue (Monthly)', value: '$34,750', change: '+8.5%', icon: 'bar-chart-2', color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  ]);
  
  // State for alerts/notifications
  const [alerts] = useState([
    { id: 1, title: 'Emergency Room Alert', message: 'ER is currently at 85% capacity', priority: 'high', time: '5 minutes ago' },
    { id: 2, title: 'Lab Results Available', message: 'New results for patient #A-12345', priority: 'medium', time: '30 minutes ago' },
    { id: 3, title: 'Staff Meeting Reminder', message: 'Monthly staff meeting at 2:00 PM today', priority: 'low', time: '2 hours ago' },
  ]);

  // Function to determine alert priority styling
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50';
      case 'medium':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };
  
  // Get icon component by name from stats
  const getStatIcon = (iconName) => {
    const Icon = getIcon(iconName);
    return <Icon className="h-5 w-5" />;
  };

  // Handler for dismissing notifications
  const handleDismissAlert = (id) => {
    toast.success("Notification dismissed successfully");
    // In a real app, this would also remove the alert from state
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col gap-8">
        {/* Welcome Section */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome to MediFlow</h1>
              <p className="text-surface-600 dark:text-surface-400 mt-1">Your comprehensive hospital management solution</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary flex items-center gap-2">
                <ActivityIcon className="h-5 w-5" />
                <span>Quick Actions</span>
              </button>
              <button className="relative btn btn-outline flex items-center">
                <BellIcon className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </section>
        
        {/* Stats Grid */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Hospital Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: stat.id * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="neu-card flex items-center gap-4"
              >
                <div className={`h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  {getStatIcon(stat.icon)}
                </div>
                <div>
                  <p className="text-sm text-surface-600 dark:text-surface-400">{stat.name}</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <span className={`text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Alert/Notification Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Alerts</h2>
            <button className="text-sm text-primary hover:text-primary-dark font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <motion.div 
                key={alert.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: alert.id * 0.1 }}
                className={`border rounded-lg p-4 ${getPriorityStyles(alert.priority)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{alert.title}</h3>
                    <p className="text-sm mt-1">{alert.message}</p>
                    <span className="text-xs opacity-75 mt-1 block">{alert.time}</span>
                  </div>
                  <button 
                    onClick={() => handleDismissAlert(alert.id)}
                    className="text-xs px-2 py-1 rounded-md bg-white/50 dark:bg-surface-800/50 hover:bg-white/80 dark:hover:bg-surface-700/80"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Main Feature Component */}
        <MainFeature />
      </div>
    </motion.div>
  );
};

export default Home;