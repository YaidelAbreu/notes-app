import { axiosMiddleware } from "./api/middleware";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import notificationReducer from "./slices/notificationSlice";
import notesSlice from "./slices/notesSlice";
import modalReducer from "./slices/modalSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    notification: notificationReducer,
    notes: notesSlice,
    modal: modalReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(axiosMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
