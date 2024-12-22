import { createSlice } from '@reduxjs/toolkit'

export const ToastSlice = createSlice({
  name: 'Toast',
  initialState: {
    success:true,
    msg:"Some error occured !!"
    
  },
  reducers: {
   StatusDone:(state,action)=>{
    state.success = true;
    state.msg = action.payload
  },
  StatusFailure:(state,action)=>{
    state.success = false;
    state.msg = action.payload
   }
  },
})

export const { StatusDone,StatusFailure } = ToastSlice.actions

export default ToastSlice.reducer