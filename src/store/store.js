import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import appointmentReducer from './appointmentSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    appointments: appointmentReducer,
  },
  devTools: import.meta.env.DEV
});