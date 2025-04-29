import { useState } from 'react'
import { useDispatch } from 'react-redux'
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
  Box
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { addReply, updateComment, deleteComment } from '../store/slices/commentSlice'

export function CommentDialog({ open, comment, onClose, position }) {
  const dispatch = useDispatch()
  const [newComment, setNewComment] = useState('')
  const [replyText, setReplyText] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState('')

  const handleAddComment = () => {
    if (newComment.trim()) {
      dispatch(updateComment({
        id: comment.id,
        content: newComment
      }))
      setNewComment('')
      onClose()
    }
  }

  const handleAddReply = () => {
    if (replyText.trim()) {
      dispatch(addReply({
        commentId: comment.id,
        reply: {
          id: Date.now().toString(),
          content: replyText,
          author: 'User',
          timestamp: new Date().toISOString()
        }
      }))
      setReplyText('')
    }
  }

  const handleEditComment = (id, initialContent) => {
    setEditingComment(id)
    setEditText(initialContent)
  }

  const handleSaveEdit = () => {
    if (editText.trim()) {
      dispatch(updateComment({
        id: editingComment,
        content: editText
      }))
      setEditingComment(null)
      setEditText('')
    }
  }

  const handleDelete = (id) => {
    dispatch(deleteComment(id))
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          position: 'fixed',
          left: `${position?.x}%`,
          top: `${position?.y}%`,
          transform: 'translate(-50%, -50%)',
          minWidth: 400
        }
      }}
    >
      <DialogTitle>
        Comment Thread
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {!comment.content ? (
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
            <Box>
              {editingComment === comment.id ? (
                <TextField
                  fullWidth
                  multiline
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography>{comment.content}</Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleEditComment(comment.id, comment.content)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(comment.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {comment.replies?.map((reply) => (
            <Box
              key={reply.id}
              sx={{
                pl: 2,
                borderLeft: 2,
                borderColor: 'divider'
              }}
            >
              {editingComment === reply.id ? (
                <TextField
                  fullWidth
                  multiline
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography>{reply.content}</Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleEditComment(reply.id, reply.content)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(reply.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
          ))}

          {comment.content && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                placeholder="Add a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleAddReply} disabled={!replyText.trim()}>
                      <ReplyIcon />
                    </IconButton>
                  )
                }}
              />
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        {!comment.content && (
          <Button onClick={handleAddComment} disabled={!newComment.trim()}>
            Add Comment
          </Button>
        )}
        {editingComment && (
          <>
            <Button onClick={() => setEditingComment(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={!editText.trim()}>
              Save
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}