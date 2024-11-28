import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    currentuser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentuser = action.payload;
            state.loading = false; // Consider setting loading to false after success
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload; // Corrected assignment here
        },
        resetState:(state,action)=>{
            state.currentuser=null;
           
        }
        
    },
});

export const { signInStart, signInSuccess, signInFailure,resetState } = userSlice.actions;
export default userSlice.reducer;
