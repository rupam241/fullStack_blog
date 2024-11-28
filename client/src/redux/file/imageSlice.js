// themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  image: '', // Default image (could be an empty string or a default image URL)
};

const imageSlice = createSlice({
  name: 'image', // Slice name
  initialState,  // Initial state
  reducers: {
    // Action to change the image
    changeImage: (state, action) => {
      state.image = action.payload; // Set the image to the new URL
    },
  },
});

// Export the action to change the image
export const { changeImage } = imageSlice.actions;

// Export the reducer to be used in the store
export default imageSlice.reducer;
