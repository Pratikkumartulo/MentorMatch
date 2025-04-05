import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Local storage
import authReducer from './AuthSlice';
import ToastSlice from './ToastSlice';
import QuoteSlice from './QuoteSlice';
import VideoId from './VideoSlice';

const authPersistConfig = {
  key: 'auth',
  storage, // Use local storage
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    Toast: ToastSlice,
    auth: persistedAuthReducer,
    TodayQuote: QuoteSlice,
    videoId: VideoId,
  },
});

export const persistor = persistStore(store);
export default store;