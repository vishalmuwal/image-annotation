import { configureStore } from '@reduxjs/toolkit'
import imageReducer from './slices/imageSlice'
import commentReducer from './slices/commentSlice'
import { loadState, saveState } from './localStorage'

// Load state from localStorage
const preloadedState = loadState()

const store = configureStore({
  reducer: {
    images: imageReducer,
    comments: commentReducer
  },
  preloadedState
})

// Save state to localStorage whenever it changes
store.subscribe(() => {
  saveState(store.getState())
})

export default store