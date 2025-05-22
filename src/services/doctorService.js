import { getApperClient } from './apperClient';

const TABLE_NAME = 'doctor';

// Separate fields by visibility for proper API operations
const ALL_FIELDS = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
  'ModifiedOn', 'ModifiedBy', 'department'
];

const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'Owner', 'department'
];

// Get all doctors with optional filters
export const getDoctors = async (filters = {}) => {
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
    
    // Add where clause if there are filters
    if (filters.search) {
      params.where = [
        {
          fieldName: 'Name',
          operator: 'Contains',
          values: [filters.search]
        }
      ];
    }
    
    // Filter by department if specified
    if (filters.departmentId) {
      params.where = params.where || [];
      params.where.push({
        fieldName: 'department',
        operator: 'ExactMatch',
        values: [filters.departmentId]
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
    }
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

// Get doctor by ID
export const getDoctorById = async (doctorId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: ALL_FIELDS
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, doctorId, params);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doctor with ID ${doctorId}:`, error);
    throw error;
  }
};

// Create a new doctor
export const createDoctor = async (doctorData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (doctorData[field] !== undefined) {
        filteredData[field] = doctorData[field];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    return response.results?.[0]?.data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

// Update a doctor
export const updateDoctor = async (doctorId, doctorData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields plus ID
    const filteredData = { Id: doctorId };
    UPDATEABLE_FIELDS.forEach(field => {
      if (doctorData[field] !== undefined) {
        filteredData[field] = doctorData[field];
      }
    });
    
    const params = { records: [filteredData] };
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    return response.results?.[0]?.data;
  } catch (error) {
    console.error(`Error updating doctor with ID ${doctorId}:`, error);
    throw error;
  }
};

// Delete a doctor
export const deleteDoctor = async (doctorId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [doctorId]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting doctor with ID ${doctorId}:`, error);
    throw error;
  }
};