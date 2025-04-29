import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: [],
  selectedImage: null,
  status: 'idle', // 'idle' | 'loading' | 'failed'
  error: null
}

export const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    addImage: (state, action) => {
      state.list.push(action.payload)
    },
    removeImage: (state, action) => {
      state.list = state.list.filter(image => image.id !== action.payload)
      if (state.selectedImage?.id === action.payload) {
        state.selectedImage = null
      }
    },
    selectImage: (state, action) => {
      state.selectedImage = action.payload
    },
    setStatus: (state, action) => {
      state.status = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.status = 'failed'
    }
  }
})

export const { addImage, removeImage, selectImage, setStatus, setError } = imageSlice.actions
export default imageSlice.reducer