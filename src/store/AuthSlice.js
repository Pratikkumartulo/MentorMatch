import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userData: null,
    isAdmin:false
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers:{
        login:(state,action)=>{
            state.status = true
            state.userData = action.payload
            state.isAdmin = false
        },
        logout:(state)=>{
            state.status = false
            state.userData = null
            state.isAdmin = false
        }
    }
})

export default authSlice.reducer

export const {login,logout} = authSlice.actions;