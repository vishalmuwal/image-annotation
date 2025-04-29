import { Box } from '@mui/material'
import { CommentPanel } from '../CommentPanel'
import { ImageViewer } from '../ImageViewer'
import { ImageGallery } from '../ImageGallery'

export function MainLayout() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: '320px 1fr 280px',
        gap: 1,
        p: 1,
        boxSizing: 'border-box',
        bgcolor: 'grey.100',
        '& > *': {
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
          overflow: 'hidden'
        }
      }}
    >
      <CommentPanel />
      <ImageViewer />
      <ImageGallery />
    </Box>
  )
}