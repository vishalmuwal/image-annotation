import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  byId: {}, // Normalized comments storage
  allIds: [], // Keep track of comment order
  markers: [], // Store marker positions
  activeComment: null
}

export const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: (state, action) => {
      const { id, content, imageId, marker, author, timestamp } = action.payload
      state.byId[id] = {
        id,
        content,
        imageId,
        author,
        timestamp,
        replies: []
      }
      state.allIds.push(id)
      state.markers.push({
        id,
        ...marker
      })
    },
    addReply: (state, action) => {
      const { commentId, reply } = action.payload
      if (state.byId[commentId]) {
        state.byId[commentId].replies.push(reply)
      }
    },
    updateComment: (state, action) => {
      const { id, content } = action.payload
      if (state.byId[id]) {
        state.byId[id].content = content
      }
    },
    deleteComment: (state, action) => {
      const id = action.payload
      delete state.byId[id]
      state.allIds = state.allIds.filter(commentId => commentId !== id)
      state.markers = state.markers.filter(marker => marker.id !== id)
    },
    setActiveComment: (state, action) => {
      state.activeComment = action.payload
    }
  }
})

export const { addComment, addReply, updateComment, deleteComment, setActiveComment } = commentSlice.actions
export default commentSlice.reducer