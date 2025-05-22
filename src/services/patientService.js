import { getApperClient } from './apperClient';

const TABLE_NAME = 'patient';

// Separate fields by visibility for proper API operations
const ALL_FIELDS = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
  'ModifiedOn', 'ModifiedBy', 'patientName', 'patientId'
];

const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'Owner', 'patientName', 'patientId'
];

// Get all patients with optional filters
export const getPatients = async (filters = {}) => {
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
          fieldName: 'patientName',
          operator: 'Contains',
          values: [filters.search]
        }
      ];
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
    console.error('Error fetching patients:', error);
    throw error;
  }
};

// Get patient by ID
export const getPatientById = async (patientId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: ALL_FIELDS
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, patientId, params);
    return response.data;
  } catch (error) {
    console.error(`Error fetching patient with ID ${patientId}:`, error);
    throw error;
  }
};

// Create a new patient
export const createPatient = async (patientData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (patientData[field] !== undefined) {
        filteredData[field] = patientData[field];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    return response.results?.[0]?.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

// Update a patient
export const updatePatient = async (patientId, patientData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields plus ID
    const filteredData = { Id: patientId };
    UPDATEABLE_FIELDS.forEach(field => {
      if (patientData[field] !== undefined) {
        filteredData[field] = patientData[field];
      }
    });
    
    const params = { records: [filteredData] };
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    return response.results?.[0]?.data;
  } catch (error) {
    console.error(`Error updating patient with ID ${patientId}:`, error);
    throw error;
  }
};

// Delete a patient
export const deletePatient = async (patientId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [patientId]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting patient with ID ${patientId}:`, error);
    throw error;
  }
};