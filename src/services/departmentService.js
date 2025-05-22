import { getApperClient } from './apperClient';

const TABLE_NAME = 'department';

// Separate fields by visibility for proper API operations
const ALL_FIELDS = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
  'ModifiedOn', 'ModifiedBy'
];

const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'Owner'
];

// Get all departments
export const getDepartments = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: ALL_FIELDS,
      pagingInfo: {
        limit: filters.limit || 100,  // Get more departments by default
        offset: filters.offset || 0
      }
    };
    
    // Add search filter if provided
    if (filters.search) {
      params.where = [
        {
          fieldName: 'Name',
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
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Get department by ID
export const getDepartmentById = async (departmentId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: ALL_FIELDS
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, departmentId, params);
    return response.data;
  } catch (error) {
    console.error(`Error fetching department with ID ${departmentId}:`, error);
    throw error;
  }
};

// Create a new department
export const createDepartment = async (departmentData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (departmentData[field] !== undefined) {
        filteredData[field] = departmentData[field];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    return response.results?.[0]?.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

// Update a department
export const updateDepartment = async (departmentId, departmentData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields plus ID
    const filteredData = { Id: departmentId };
    UPDATEABLE_FIELDS.forEach(field => {
      if (departmentData[field] !== undefined) {
        filteredData[field] = departmentData[field];
      }
    });
    
    const params = { records: [filteredData] };
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    return response.results?.[0]?.data;
  } catch (error) {
    console.error(`Error updating department with ID ${departmentId}:`, error);
    throw error;
  }
};

// Delete a department
export const deleteDepartment = async (departmentId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [departmentId]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting department with ID ${departmentId}:`, error);
    throw error;
  }
};