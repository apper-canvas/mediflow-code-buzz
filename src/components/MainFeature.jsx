import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const MainFeature = () => {
  // Icon components
  const UserIcon = getIcon('user');
  const CalendarIcon = getIcon('calendar');
  const ClockIcon = getIcon('clock');
  const CheckIcon = getIcon('check-circle');
  const XIcon = getIcon('x-circle');
  const FilterIcon = getIcon('filter');
  const PlusIcon = getIcon('plus');
  const SearchIcon = getIcon('search');
  const EditIcon = getIcon('edit-2');
  const TrashIcon = getIcon('trash-2');
  
  // State for appointments
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    date: '',
    time: '',
    department: '',
    doctor: '',
    appointmentType: '',
    notes: '',
    status: 'scheduled'
  });
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  
  // Dummy data initialization
  useEffect(() => {
    const dummyAppointments = [
      {
        id: 1,
        patientName: 'John Smith',
        patientId: 'P-10042',
        date: '2023-09-18',
        time: '09:30',
        department: 'Cardiology',
        doctor: 'Dr. Maria Johnson',
        appointmentType: 'Follow-up',
        notes: 'Blood pressure check and medication review',
        status: 'scheduled'
      },
      {
        id: 2,
        patientName: 'Emily Davis',
        patientId: 'P-10078',
        date: '2023-09-18',
        time: '10:15',
        department: 'Neurology',
        doctor: 'Dr. Robert Chen',
        appointmentType: 'Consultation',
        notes: 'Initial consultation for recurring headaches',
        status: 'completed'
      },
      {
        id: 3,
        patientName: 'Michael Wilson',
        patientId: 'P-10103',
        date: '2023-09-18',
        time: '14:00',
        department: 'Orthopedics',
        doctor: 'Dr. Sarah Miller',
        appointmentType: 'Pre-surgery',
        notes: 'Pre-operative assessment for knee replacement',
        status: 'cancelled'
      },
      {
        id: 4,
        patientName: 'Lisa Brown',
        patientId: 'P-10117',
        date: '2023-09-19',
        time: '11:30',
        department: 'Dermatology',
        doctor: 'Dr. James Wilson',
        appointmentType: 'Checkup',
        notes: 'Annual skin examination',
        status: 'scheduled'
      },
      {
        id: 5,
        patientName: 'David Thompson',
        patientId: 'P-10129',
        date: '2023-09-19',
        time: '15:45',
        department: 'Ophthalmology',
        doctor: 'Dr. Elizabeth Taylor',
        appointmentType: 'Follow-up',
        notes: 'Post-operative checkup after cataract surgery',
        status: 'scheduled'
      }
    ];
    
    setAppointments(dummyAppointments);
    setFilteredAppointments(dummyAppointments);
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...appointments];
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(appointment => appointment.status === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(appointment => 
        appointment.patientName.toLowerCase().includes(search) ||
        appointment.patientId.toLowerCase().includes(search) ||
        appointment.doctor.toLowerCase().includes(search) ||
        appointment.department.toLowerCase().includes(search)
      );
    }
    
    setFilteredAppointments(result);
  }, [appointments, filter, searchTerm]);
  
  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.patientName.trim()) errors.patientName = 'Patient name is required';
    if (!formData.patientId.trim()) errors.patientId = 'Patient ID is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.doctor.trim()) errors.doctor = 'Doctor name is required';
    if (!formData.appointmentType) errors.appointmentType = 'Appointment type is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (currentAppointment) {
      // Update existing appointment
      const updatedAppointments = appointments.map(appointment => 
        appointment.id === currentAppointment.id 
          ? { ...formData, id: currentAppointment.id } 
          : appointment
      );
      
      setAppointments(updatedAppointments);
      toast.success("Appointment updated successfully");
    } else {
      // Create new appointment
      const newAppointment = {
        ...formData,
        id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1
      };
      
      setAppointments([...appointments, newAppointment]);
      toast.success("Appointment created successfully");
    }
    
    // Reset form
    resetForm();
  };
  
  const handleEdit = (appointment) => {
    setCurrentAppointment(appointment);
    setFormData({
      patientName: appointment.patientName,
      patientId: appointment.patientId,
      date: appointment.date,
      time: appointment.time,
      department: appointment.department,
      doctor: appointment.doctor,
      appointmentType: appointment.appointmentType,
      notes: appointment.notes,
      status: appointment.status
    });
    setIsFormOpen(true);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(appointment => appointment.id !== id));
      toast.success("Appointment deleted successfully");
    }
  };
  
  const resetForm = () => {
    setFormData({
      patientName: '',
      patientId: '',
      date: '',
      time: '',
      department: '',
      doctor: '',
      appointmentType: '',
      notes: '',
      status: 'scheduled'
    });
    setFormErrors({});
    setCurrentAppointment(null);
    setIsFormOpen(false);
  };
  
  // Status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <CalendarIcon className="h-3 w-3" />
            Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <CheckIcon className="h-3 w-3" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <XIcon className="h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };
  
  return (
    <section className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div className="p-6 border-b border-surface-200 dark:border-surface-700">
        <h2 className="text-xl font-semibold">Appointment Management</h2>
        <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
          Schedule, track, and manage patient appointments
        </p>
      </div>
      
      {/* Control panel */}
      <div className="p-6 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-surface-400" />
              </div>
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-2 pr-4 w-full sm:w-64 rounded-lg border border-surface-300 dark:border-surface-600 
                          bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="relative">
              <button 
                className="flex items-center gap-2 py-2 px-4 rounded-lg border border-surface-300 dark:border-surface-600
                          bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700"
              >
                <FilterIcon className="h-4 w-4 text-surface-600 dark:text-surface-400" />
                <span>Filter</span>
              </button>
              
              <div className="absolute mt-1 right-0 z-10 w-48 bg-white dark:bg-surface-800 border border-surface-200 
                            dark:border-surface-700 rounded-lg shadow-lg overflow-hidden">
                <div className="p-2">
                  <button 
                    onClick={() => setFilter('all')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${filter === 'all' ? 
                              'bg-primary text-white' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                  >
                    All Appointments
                  </button>
                  <button 
                    onClick={() => setFilter('scheduled')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${filter === 'scheduled' ? 
                              'bg-primary text-white' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                  >
                    Scheduled
                  </button>
                  <button 
                    onClick={() => setFilter('completed')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${filter === 'completed' ? 
                              'bg-primary text-white' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                  >
                    Completed
                  </button>
                  <button 
                    onClick={() => setFilter('cancelled')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${filter === 'cancelled' ? 
                              'bg-primary text-white' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>
      
      {/* Appointment list */}
      <div className="p-6">
        {filteredAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800 text-left">
                  <th className="px-4 py-3 font-semibold text-sm text-surface-600 dark:text-surface-400">Patient</th>
                  <th className="px-4 py-3 font-semibold text-sm text-surface-600 dark:text-surface-400 hidden md:table-cell">Date & Time</th>
                  <th className="px-4 py-3 font-semibold text-sm text-surface-600 dark:text-surface-400 hidden lg:table-cell">Department</th>
                  <th className="px-4 py-3 font-semibold text-sm text-surface-600 dark:text-surface-400 hidden sm:table-cell">Status</th>
                  <th className="px-4 py-3 font-semibold text-sm text-surface-600 dark:text-surface-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {filteredAppointments.map((appointment) => (
                  <motion.tr 
                    key={appointment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-surface-50 dark:hover:bg-surface-800/50"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-xs text-surface-500 dark:text-surface-400">{appointment.patientId}</div>
                          <div className="text-xs text-surface-500 dark:text-surface-400 md:hidden mt-1">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </div>
                          <div className="text-xs text-surface-500 dark:text-surface-400 sm:hidden mt-1">
                            {getStatusBadge(appointment.status)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4 text-surface-400" />
                          <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-surface-500 dark:text-surface-400">
                          <ClockIcon className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div>{appointment.department}</div>
                      <div className="text-sm text-surface-500 dark:text-surface-400">{appointment.doctor}</div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(appointment)}
                          className="p-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400 
                                   hover:text-primary dark:hover:text-primary-light transition-colors"
                          aria-label="Edit appointment"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(appointment.id)}
                          className="p-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400 
                                   hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          aria-label="Delete appointment"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
              <CalendarIcon className="h-8 w-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No appointments found</h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto">
              {searchTerm || filter !== 'all' 
                ? "Try adjusting your search or filter criteria to find what you're looking for."
                : "Get started by creating your first appointment using the 'New Appointment' button."}
            </p>
          </div>
        )}
      </div>
      
      {/* Appointment form modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-surface-200 dark:border-surface-700 sticky top-0 bg-white dark:bg-surface-800 z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    {currentAppointment ? 'Edit Appointment' : 'New Appointment'}
                  </h3>
                  <button 
                    onClick={resetForm}
                    className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Information */}
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-medium mb-4">Patient Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="patientName" className="input-label">Patient Name</label>
                        <input
                          type="text"
                          id="patientName"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleInputChange}
                          className={`input ${formErrors.patientName ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        {formErrors.patientName && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.patientName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="patientId" className="input-label">Patient ID</label>
                        <input
                          type="text"
                          id="patientId"
                          name="patientId"
                          value={formData.patientId}
                          onChange={handleInputChange}
                          placeholder="e.g., P-10042"
                          className={`input ${formErrors.patientId ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        {formErrors.patientId && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.patientId}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Appointment Details */}
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-medium mb-4">Appointment Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="date" className="input-label">Date</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className={`input ${formErrors.date ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        {formErrors.date && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.date}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="time" className="input-label">Time</label>
                        <input
                          type="time"
                          id="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className={`input ${formErrors.time ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        {formErrors.time && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.time}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="department" className="input-label">Department</label>
                        <select
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className={`input ${formErrors.department ? 'border-red-500 dark:border-red-500' : ''}`}
                        >
                          <option value="">Select department</option>
                          <option value="Cardiology">Cardiology</option>
                          <option value="Dermatology">Dermatology</option>
                          <option value="Neurology">Neurology</option>
                          <option value="Ophthalmology">Ophthalmology</option>
                          <option value="Orthopedics">Orthopedics</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="Psychiatry">Psychiatry</option>
                          <option value="Urology">Urology</option>
                        </select>
                        {formErrors.department && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.department}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="doctor" className="input-label">Doctor</label>
                        <input
                          type="text"
                          id="doctor"
                          name="doctor"
                          value={formData.doctor}
                          onChange={handleInputChange}
                          placeholder="e.g., Dr. Maria Johnson"
                          className={`input ${formErrors.doctor ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        {formErrors.doctor && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.doctor}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="appointmentType" className="input-label">Appointment Type</label>
                        <select
                          id="appointmentType"
                          name="appointmentType"
                          value={formData.appointmentType}
                          onChange={handleInputChange}
                          className={`input ${formErrors.appointmentType ? 'border-red-500 dark:border-red-500' : ''}`}
                        >
                          <option value="">Select type</option>
                          <option value="Checkup">Checkup</option>
                          <option value="Consultation">Consultation</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Pre-surgery">Pre-surgery</option>
                          <option value="Post-surgery">Post-surgery</option>
                          <option value="Vaccination">Vaccination</option>
                          <option value="Lab Work">Lab Work</option>
                        </select>
                        {formErrors.appointmentType && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.appointmentType}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="notes" className="input-label">Notes</label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Add any special notes or instructions..."
                          rows="3"
                          className="input"
                        ></textarea>
                      </div>
                      <div>
                        <label htmlFor="status" className="input-label">Status</label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {currentAppointment ? 'Update Appointment' : 'Create Appointment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MainFeature;