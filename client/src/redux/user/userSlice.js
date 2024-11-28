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
       updateStart:(state,action)=>{
        state.loading = true;
        state.error = null;
       },
       updateSucess:(state,action)=>{
        state.currentuser=action.payload;
        state.loading = false;
        state.error=null

       },
       updateFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload; // Corrected assignment here
    },
        
    },
});

export const { signInStart, signInSuccess, signInFailure,updateFailure,updateStart,updateSucess } = userSlice.actions;
export default userSlice.reducer;
