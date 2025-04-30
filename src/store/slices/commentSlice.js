import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  byId: {}, // Normalized comments storage
  allIds: [], // Keep track of comment order
  markers: [], // Store marker positions
  activeComment: null,
};

const createReply = (content, parentId) => ({
  id: Date.now().toString(),
  content,
  parentId,
  author: "User",
  timestamp: new Date().toISOString(),
  replies: [],
});

export const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: (state, action) => {
      const { id, content, imageId, marker, author, timestamp } =
        action.payload;
      state.byId[id] = {
        id,
        content,
        imageId,
        author,
        timestamp,
        replies: [],
        parentId: null,
      };
      state.allIds.push(id);
      state.markers.push({
        id,
        ...marker,
      });
    },
    addReply: (state, action) => {
      const { parentId, content } = action.payload;
      const reply = createReply(content, parentId);

      // Add the reply to the state
      state.byId[reply.id] = reply;
      state.allIds.push(reply.id);

      // Add reference to parent's replies array
      if (state.byId[parentId]) {
        state.byId[parentId].replies.push(reply.id);
      }
    },
    updateComment: (state, action) => {
      const { id, content } = action.payload;
      if (state.byId[id]) {
        state.byId[id].content = content;
      }
    },
    deleteComment: (state, action) => {
      const deleteRecursive = (id) => {
        const comment = state.byId[id];
        if (!comment) return;

        // Delete all nested replies first
        comment.replies.forEach((replyId) => deleteRecursive(replyId));

        // Remove from parent's replies array
        if (comment.parentId && state.byId[comment.parentId]) {
          state.byId[comment.parentId].replies = state.byId[
            comment.parentId
          ].replies.filter((r) => r !== id);
        }

        // Delete the comment itself
        delete state.byId[id];
        state.allIds = state.allIds.filter((commentId) => commentId !== id);
      };

      deleteRecursive(action.payload);
      state.markers = state.markers.filter(
        (marker) => marker.id !== action.payload
      );
    },
    setActiveComment: (state, action) => {
      state.activeComment = action.payload;
    },
    deleteImageComments: (state, action) => {
      const imageId = action.payload;
      // Find all comments for this image
      const commentsToDelete = Object.values(state.byId)
        .filter(comment => comment.imageId === imageId)
        .map(comment => comment.id);

      // Delete each comment and its replies
      commentsToDelete.forEach(commentId => {
        const deleteRecursive = (id) => {
          const comment = state.byId[id];
          if (!comment) return;

          // Delete all nested replies first
          comment.replies.forEach((replyId) => deleteRecursive(replyId));

          // Delete the comment itself
          delete state.byId[id];
          state.allIds = state.allIds.filter((cId) => cId !== id);
        };

        deleteRecursive(commentId);
      });

      // Remove all markers for this image
      state.markers = state.markers.filter(marker => marker.imageId !== imageId);
    },
  },
});

export const {
  addComment,
  addReply,
  updateComment,
  deleteComment,
  setActiveComment,
  deleteImageComments,
} = commentSlice.actions;

export default commentSlice.reducer;
