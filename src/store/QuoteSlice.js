import { createSlice } from "@reduxjs/toolkit";

export const QuoteSlice = createSlice({
    name: 'TodayQuote',
    initialState: {
        value: "", // Store the quote of the day
        isFetched: false, // Track whether the quote has already been fetched
    },
    reducers: {
        setQuote: (state, action) => {
            state.value = action.payload; // Store the fetched quote
            state.isFetched = true; // Mark as fetched
        },
    },
});

export const { setQuote } = QuoteSlice.actions;

export default QuoteSlice.reducer;
