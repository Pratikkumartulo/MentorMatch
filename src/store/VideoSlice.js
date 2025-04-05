import { createSlice } from '@reduxjs/toolkit'
import { set } from 'react-hook-form'

export const VideoId = createSlice({
  name: 'videoId',
  initialState: {
    id: null,
  },
  reducers: {
   setVideoId:(state,action)=>{
    state.id = action.payload
   },
  },
})

export const { setVideoId } = VideoId.actions

export default VideoId.reducer