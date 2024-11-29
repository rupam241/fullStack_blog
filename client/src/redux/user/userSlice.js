import { createSlice, current, nanoid } from "@reduxjs/toolkit";

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
    deleteAccountSucess:(state,action)=>{
        state.currentuser=null;
        state.loading=false;
        state.error=false
    },
    deleteAccountStart:(state,action)=>{
        state.loading = true;
        state.error = null;
       },
       deleteAccountFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload; // Corrected assignment here
    },

          signoutSucess:(state,action)=>{
        state.currentuser=null;
        state.loading=false;
        state.error=false
    },
    signoutStart:(state,action)=>{
        state.loading = true;
        state.error = null;
       },
       signoutFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload; // Corrected assignment here
    },
    },
});

export const { signInStart, signInSuccess, signInFailure,updateFailure,updateStart,updateSucess,deleteAccountSucess,deleteAccountStart,deleteAccountFailure ,signoutFailure,signoutStart,signoutSucess} = userSlice.actions;
export default userSlice.reducer;
