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
import { addReply, updateComment, deleteComment, deleteReply } from '../store/slices/commentSlice'

export function CommentDialog({ open, comment, onClose, position }) {
  const dispatch = useDispatch()
  const [newComment, setNewComment] = useState('')
  const [replyText, setReplyText] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState('')

  const handleAddComment = () => {
    if (!newComment.trim()) {
      dispatch(deleteComment(comment.id))
      onClose()
      return
    }

    dispatch(updateComment({
      id: comment.id,
      content: newComment
    }))
    setNewComment('')
    onClose()
  }

  const handleClose = () => {
    if (!comment.content) {
      dispatch(deleteComment(comment.id))
    }
    onClose()
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

  const handleDelete = (id, isReply = false) => {
    if (isReply) {
      dispatch(deleteReply({
        commentId: comment.id,
        replyId: id
      }))
    } else {
      dispatch(deleteComment(id))
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          onClick={handleClose}
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
                    <IconButton size="small" onClick={() => handleDelete(reply.id, true)}>
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