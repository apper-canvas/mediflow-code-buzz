import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  loading: false,
  error: null,
  filter: 'all',
  searchTerm: '',
};

export const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setAppointments, setLoading, setError, setFilter, setSearchTerm } = appointmentSlice.actions;
export default appointmentSlice.reducer;