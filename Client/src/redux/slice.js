import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    user: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.isLoggedIn = true
        },
        clearUser: (state) => {
            state.user = null
            state.isLoggedIn = false
        }
    },
});

// Export the auto-generated action creators
export const { setUser, clearUser } = authSlice.actions;

// Export the reducer to be registered in the store
export default authSlice.reducer;
