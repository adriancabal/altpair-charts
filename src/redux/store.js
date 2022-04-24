import { configureStore } from '@reduxjs/toolkit';
import coinMapReducer from './coinMapSlice';
import chartDataReducer from './chartDataSlice';

export default configureStore({
  reducer: {
      coinMap: coinMapReducer,
      chartData: chartDataReducer,
  },
});