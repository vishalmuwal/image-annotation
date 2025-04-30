import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  IconButton,
  Box,
  Paper,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  addReply,
  updateComment,
  deleteComment,
} from "../store/slices/commentSlice";

// Add this at the top of the file after imports
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Comment = ({ comment, level = 0, onReply, onClose }) => {
  const dispatch = useDispatch();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isExpanded, setIsExpanded] = useState(false);
  const allComments = useSelector((state) => state.comments.byId);

  const nestedReplies = Object.values(allComments || {}).filter(
    (reply) => reply.parentId === comment.id
  );

  const debouncedReplyContent = useDebounce(replyContent, 300);
  const debouncedEditContent = useDebounce(editContent, 300);

  const handleAddReply = () => {
    if (!debouncedReplyContent.trim()) return;
    dispatch(
      addReply({
        parentId: comment.id,
        content: debouncedReplyContent,
      })
    );
    setReplyContent("");
    setIsReplying(false);
    setIsExpanded(true);
  };

  const handleEdit = () => {
    if (!debouncedEditContent.trim()) return;
    dispatch(
      updateComment({
        id: comment.id,
        content: debouncedEditContent,
      })
    );
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteComment(comment.id));
    if (!comment.parentId) {
      // If it's a top-level comment
      onClose();
    }
  };

  return (
    <Box
      sx={{
        ml: level * 2,
        mb: 1.5,
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          {comment.author[0].toUpperCase()}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              bgcolor: "grey.100",
              borderRadius: 2,
              p: 1.5,
              "& > *": { mb: 0.5 },
              "& > *:last-child": { mb: 0 },
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {comment.author}
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                size="small"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                sx={{ mt: 1 }}
              />
            ) : (
              <Typography variant="body2">{comment.content}</Typography>
            )}
          </Box>
          <Box sx={{ mt: 0.5, display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              size="small"
              sx={{
                minWidth: 0,
                color: "text.secondary",
                textTransform: "none",
                p: 0,
              }}
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </Button>
            {nestedReplies.length > 0 && (
              <Button
                size="small"
                sx={{
                  minWidth: 0,
                  color: "text.secondary",
                  textTransform: "none",
                  p: 0,
                }}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded
                  ? "Hide replies"
                  : `Show ${nestedReplies.length} ${
                      nestedReplies.length === 1 ? "reply" : "replies"
                    }`}
              </Button>
            )}
            <Button
              size="small"
              sx={{
                minWidth: 0,
                color: "text.secondary",
                textTransform: "none",
                p: 0,
              }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              size="small"
              sx={{
                minWidth: 0,
                color: "error.main",
                textTransform: "none",
                p: 0,
              }}
              onClick={handleDelete}
            >
              Delete
            </Button>
            {isEditing && (
              <>
                <Button
                  size="small"
                  sx={{
                    minWidth: 0,
                    color: "text.secondary",
                    textTransform: "none",
                    p: 0,
                  }}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  sx={{
                    minWidth: 0,
                    color: "primary.main",
                    textTransform: "none",
                    p: 0,
                  }}
                  onClick={handleEdit}
                >
                  Save
                </Button>
              </>
            )}
          </Box>

          {isReplying && (
            <Box sx={{ mt: 1.5, display: "flex", gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                U
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  size="small"
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                  <Button
                    size="small"
                    onClick={() => setIsReplying(false)}
                    sx={{ textTransform: "none" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleAddReply}
                    sx={{ textTransform: "none" }}
                  >
                    Reply
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {isExpanded &&
            nestedReplies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                level={level + 1}
                onReply={onReply}
                onClose={onClose}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
};

// Add this helper function at the top of the file, after imports
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function CommentDialog({ open, comment, onClose, position }) {
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");
  const debouncedNewComment = useDebounce(newComment, 300);
  const commentFromStore = useSelector(
    (state) => state.comments.byId[comment?.id]
  );
  const currentComment = comment?.id ? commentFromStore || comment : comment;
  const selectedImage = useSelector((state) => state.images.selectedImage);
  const markers = useSelector((state) => state.comments.markers);

  const getMarkerNumber = (commentId) => {
    const index = markers
      .filter((marker) => marker.imageId === selectedImage?.id)
      .findIndex((marker) => marker.id === commentId);
    return index + 1;
  };

  const handleAddComment = () => {
    if (!debouncedNewComment.trim()) {
      dispatch(deleteComment(comment.id));
      onClose();
      return;
    }

    dispatch(
      updateComment({
        id: comment.id,
        content: debouncedNewComment,
      })
    );
    setNewComment("");
    onClose();
  };

  const handleClose = () => {
    if (!comment.content) {
      dispatch(deleteComment(comment.id));
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: { backgroundColor: "transparent" },
      }}
      PaperProps={{
        sx: {
          position: "absolute",
          left: position ? `${clamp(position.x, 20, 80)}%` : "50%",
          top: position ? `${clamp(position.y, 20, 70)}%` : "70%",
          transform:
            position?.y > 70
              ? "translate(-50%, calc(-100% - 16px))"
              : "translate(-50%, 16px)",
          width: 400,
          height: 250,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 2,
          pb: 1,
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        Comment Thread #{getMarkerNumber(comment?.id)}
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 2,
          flex: "1 1 auto",
          minHeight: 0, // Add this to ensure content can shrink
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
            display: "block", // Ensure scrollbar is always visible
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
            "&:hover": {
              background: "#555",
            },
          },
        }}
      >
        <Stack
          spacing={2}
          sx={{
            maxWidth: "100%",
            wordBreak: "break-word",
            minHeight: "200px", // Add minimum height to ensure content is scrollable
          }}
        >
          {!currentComment?.content ? (
            <TextField
              autoFocus
              fullWidth
              multiline
              rows={3}
              placeholder="Add your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          ) : (
            <Comment comment={currentComment} onClose={onClose} />
          )}
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
          pt: 1,
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        {!currentComment?.content && (
          <Button onClick={handleAddComment} disabled={!newComment.trim()}>
            Add Comment
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
