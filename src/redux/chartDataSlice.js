import { createSlice } from '@reduxjs/toolkit';
// Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
export const chartDataSlice = createSlice({
  name: 'chartData',
  initialState: {
    // coin1: "",
    // coin2: "",
    coinPair: [],
    chartPrice: [],
  },
  reducers: {
    // setCoin1: (state, action) => { 
    //   state.coin1 = action.payload;
    // },
    // setCoin2: (state, action) => {
    //     state.coin2 = action.payload;
    // },
    setCoinPair: (state, action) => {
      // alert("setCoinPair: " + JSON.stringify(action.payload));
      state.coinPair = action.payload;
    },
    setChartPrice: (state, action) => {
        state.chartPrice = action.payload;
    },
    reset: (state) => {
        // state.coin1 = "";
        // state.coin2 = "";
        state.coinPair = [];
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCoinPair, setChartPrice, reset } = chartDataSlice.actions

export default chartDataSlice.reducer