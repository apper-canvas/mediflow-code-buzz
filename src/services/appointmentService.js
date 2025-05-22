import { getApperClient } from './apperClient';

const TABLE_NAME = 'appointment';

// Separate fields by visibility for proper API operations
const ALL_FIELDS = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
  'ModifiedOn', 'ModifiedBy', 'patient', 'date', 'time',
  'department', 'doctor', 'appointmentType', 'notes', 'status'
];

const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'Owner', 'patient', 'date', 'time',
  'department', 'doctor', 'appointmentType', 'notes', 'status'
];

// Get all appointments with optional filters
export const getAppointments = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    // Prepare query parameters
    const params = {
      fields: ALL_FIELDS,
      pagingInfo: {
        limit: filters.limit || 20,
        offset: filters.offset || 0
      }
    };
    
    // Add where clause for status filter
    if (filters.status && filters.status !== 'all') {
      params.where = [
        {
          fieldName: 'status',
          operator: 'ExactMatch',
          values: [filters.status]
        }
      ];
    }
    
    // Add search filter if provided
    if (filters.search) {
      // Create OR condition for searching multiple fields
      const searchConditions = [
        {
          fieldName: 'Name',
          operator: 'Contains',
          values: [filters.search]
        },
        {
          fieldName: 'patient',
          operator: 'Contains',
          values: [filters.search]
        },
        {
          fieldName: 'doctor',
          operator: 'Contains',
          values: [filters.search]
        },
        {
          fieldName: 'department',
          operator: 'Contains',
          values: [filters.search]
        }
      ];
      
      params.whereGroups = [
        {
          operator: 'OR',
          subGroups: searchConditions.map(condition => ({
            conditions: [condition],
            operator: ''
          }))
        }
      ];
    }
    
    // Add date filter if provided
    if (filters.date) {
      params.where = params.where || [];
      params.where.push({
        fieldName: 'date',
        operator: 'ExactMatch',
        values: [filters.date]
      });
    }
    
    // Add sorting if specified
    if (filters.orderBy) {
      params.orderBy = [
        {
          fieldName: filters.orderBy,
          SortType: filters.sortDirection || 'ASC'
        }
      ];
    } else {
      // Default sorting by date, then time
      params.orderBy = [
        {
          fieldName: 'date',
          SortType: 'ASC'
        },
        {
          fieldName: 'time',
          SortType: 'ASC'
        }
      ];
    }
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Get appointment by ID
export const getAppointmentById = async (appointmentId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: ALL_FIELDS
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, appointmentId, params);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointment with ID ${appointmentId}:`, error);
    throw error;
  }
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (appointmentData[field] !== undefined) {
        filteredData[field] = appointmentData[field];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    return response.results?.[0]?.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Update an appointment
export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields plus ID
    const filteredData = { Id: appointmentId };
    UPDATEABLE_FIELDS.forEach(field => {
      if (appointmentData[field] !== undefined) {
        filteredData[field] = appointmentData[field];
      }
    });
    
    const params = { records: [filteredData] };
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    return response.results?.[0]?.data;
  } catch (error) {
    console.error(`Error updating appointment with ID ${appointmentId}:`, error);
    throw error;
  }
};

// Delete an appointment
export const deleteAppointment = async (appointmentId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [appointmentId]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting appointment with ID ${appointmentId}:`, error);
    throw error;
  }
};