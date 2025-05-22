import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter, setSearchTerm } from '../store/appointmentSlice';
import { getIcon } from '../utils/iconUtils';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../services/appointmentService';
import { getDepartments } from '../services/departmentService';
import { getDoctors } from '../services/doctorService';
import { getPatients } from '../services/patientService';

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
  
  const dispatch = useDispatch();
  
  // State for appointments
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Get filter and search from Redux
  const { filter, searchTerm } = useSelector((state) => state.appointments);
  
  // Form state
  const [formData, setFormData] = useState({
    Name: '',
    patient: '',
    date: '',
    time: '',
    department: '',
    doctor: '',
    appointmentType: '',
    notes: '',
    status: 'scheduled',
    Tags: ''
  });
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch appointments
  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        setLoadingAppointments(true);
        const filters = {};
        
        if (filter !== 'all') {
          filters.status = filter;
        }
        
        if (searchTerm) {
          filters.search = searchTerm;
        }
        
        const appointmentsData = await getAppointments(filters);
        setAppointments(appointmentsData);
        setFilteredAppointments(appointmentsData);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        toast.error('Failed to load appointments. Please try again.');
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointmentData();
  }, [filter, searchTerm]);
  
  // Fetch reference data (departments, doctors, patients)
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        // Fetch departments
        setLoadingDepartments(true);
        const departmentsData = await getDepartments();
        setDepartments(departmentsData);
        setLoadingDepartments(false);
        
        // Fetch doctors
        setLoadingDoctors(true);
        const doctorsData = await getDoctors();
        setDoctors(doctorsData);
        setLoadingDoctors(false);
        
        // Fetch patients
        setLoadingPatients(true);
        const patientsData = await getPatients();
        setPatients(patientsData);
        setLoadingPatients(false);
        
      } catch (error) {
        console.error('Failed to fetch reference data:', error);
        toast.error('Failed to load reference data. Some dropdown options may be missing.');
        setLoadingDepartments(false);
        setLoadingDoctors(false);
        setLoadingPatients(false);
      }
    };
    
    fetchReferenceData();
  }, []);
  
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
    if (!formData.Name.trim()) errors.Name = 'Appointment name is required';
    if (!formData.patient) errors.patient = 'Patient is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.doctor) errors.doctor = 'Doctor is required';
    if (!formData.appointmentType) errors.appointmentType = 'Appointment type is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  const handleSubmit = async (e) => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      if (currentAppointment) {
        await updateAppointment(currentAppointment.Id, formData);
        toast.success("Appointment updated successfully");
      } else {
        await createAppointment(formData);
        toast.success("Appointment created successfully");
      }
      
      // Refresh appointments data
      const updatedAppointments = await getAppointments({
        status: filter !== 'all' ? filter : undefined,
        search: searchTerm || undefined
      });
      
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Appointment operation failed:', error);
      toast.error(currentAppointment 
        ? "Failed to update appointment. Please try again." 
        : "Failed to create appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (appointment) => {
    try {
      // Fetch the full appointment details if needed
      const fullAppointment = appointment;
      
      setCurrentAppointment(fullAppointment);
      setFormData({
        Name: fullAppointment.Name || '',
        patient: fullAppointment.patient || '',
        date: fullAppointment.date || '',
        time: fullAppointment.time || '',
        department: fullAppointment.department || '',
        doctor: fullAppointment.doctor || '',
        appointmentType: fullAppointment.appointmentType || '',
        notes: fullAppointment.notes || '',
        status: fullAppointment.status || 'scheduled',
        Tags: fullAppointment.Tags || ''
      });
      setIsFormOpen(true);
    } catch (error) {
      console.error('Failed to load appointment details:', error);
      toast.error('Failed to load appointment details. Please try again.');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(id);
        
        // Refresh appointments after delete
        const updatedAppointments = await getAppointments({
          status: filter !== 'all' ? filter : undefined,
          search: searchTerm || undefined
        });
        
        setAppointments(updatedAppointments);
        setFilteredAppointments(updatedAppointments);
        
        toast.success("Appointment deleted successfully");
      } catch (error) {
        console.error('Failed to delete appointment:', error);
        toast.error('Failed to delete appointment. Please try again.');
      }
    }
  };
  
  const handleFilterChange = (newFilter) => {
    dispatch(setFilter(newFilter));
  };
  
  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };
  
  const resetForm = () => {
    setFormData({
      Name: '',
      patient: '',
      date: '',
      time: '',
      department: '',
      doctor: '',
      appointmentType: '',
      notes: '',
      status: 'scheduled',
      Tags: ''
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
  
  // Find patient name by ID
  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === patientId);
    return patient ? patient.patientName : 'Unknown Patient';
  };
  
  // Find department name by ID
  const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.Id === departmentId);
    return department ? department.Name : 'Unknown Department';
  };
  
  // Find doctor name by ID
  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.Id === doctorId);
    return doctor ? doctor.Name : 'Unknown Doctor';
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
                onChange={handleSearchChange}
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
                    onClick={() => handleFilterChange('all')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${filter === 'all' ? 
                              'bg-primary text-white' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                  >
                    All Appointments
                  </button>
                  <button 
                    onClick={() => handleFilterChange('scheduled')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${filter === 'scheduled' ? 
                              'bg-primary text-white' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                  >
                    Scheduled
                  </button>
                  <button 
                    onClick={() => handleFilterChange('completed')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${filter === 'completed' ? 
                              'bg-primary text-white' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                  >
                    Completed
                  </button>
                  <button 
                    onClick={() => handleFilterChange('cancelled')}
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
        {loadingAppointments ? (
          <div className="py-12 text-center">
            <p className="text-surface-600 dark:text-surface-400">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length > 0 ? (
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
                    key={appointment.Id}
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
                          <div className="font-medium">{getPatientName(appointment.patient)}</div>
                          <div className="text-xs text-surface-500 dark:text-surface-400">{appointment.Name}</div>
                          <div className="text-xs text-surface-500 dark:text-surface-400 md:hidden mt-1">
                            {appointment.date} at {appointment.time}
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
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-surface-500 dark:text-surface-400">
                          <ClockIcon className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div>{getDepartmentName(appointment.department)}</div>
                      <div className="text-sm text-surface-500 dark:text-surface-400">{getDoctorName(appointment.doctor)}</div>
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
                          onClick={() => handleDelete(appointment.Id)}
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
                    <h4 className="text-lg font-medium mb-4">Appointment Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="Name" className="input-label">Appointment Name</label>
                        <input
                          type="text"
                          id="Name"
                          name="Name"
                          value={formData.Name}
                          onChange={handleInputChange}
                          placeholder="e.g., Annual Checkup"
                          className={`input ${formErrors.Name ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        {formErrors.Name && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.Name}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="patient" className="input-label">Patient</label>
                        <select
                          id="patient"
                          name="patient"
                          value={formData.patient}
                          onChange={handleInputChange}
                          className={`input ${formErrors.patient ? 'border-red-500 dark:border-red-500' : ''}`}
                          disabled={loadingPatients}
                        >
                          <option value="">Select patient</option>
                          {patients.map(patient => (
                            <option key={patient.Id} value={patient.Id}>{patient.patientName}</option>
                          ))}
                        </select>
                        {formErrors.patient && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.patient}</p>
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
                          disabled={loadingDepartments}
                        >
                          <option value="">Select department</option>
                          {departments.map(dept => (
                            <option key={dept.Id} value={dept.Id}>{dept.Name}</option>
                          ))}
                        </select>
                        {formErrors.department && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.department}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="doctor" className="input-label">Doctor</label>
                        <select
                          id="doctor"
                          name="doctor"
                          value={formData.doctor}
                          onChange={handleInputChange}
                          className={`input ${formErrors.doctor ? 'border-red-500 dark:border-red-500' : ''}`}
                          disabled={loadingDoctors}
                        >
                          <option value="">Select doctor</option>
                          {doctors.map(doc => (
                            <option key={doc.Id} value={doc.Id}>{doc.Name}</option>
                          ))}
                        </select>
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
                    disabled={submitting}
                    className="btn btn-primary"
                  >
                    {submitting ? 'Saving...' : (currentAppointment ? 'Update Appointment' : 'Create Appointment')}
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