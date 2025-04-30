import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import { selectImage, removeImage } from "../store/slices/imageSlice";
import { deleteImageComments } from "../store/slices/commentSlice";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export function ImageGallery() {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.list);
  const selectedImage = useSelector((state) => state.images.selectedImage);
  const comments = useSelector((state) => state.comments.byId);

  const getCommentCount = (imageId) => {
    return Object.values(comments).filter(
      (comment) => comment.imageId === imageId
    ).length;
  };

  const handleImageSelect = (image) => {
    dispatch(selectImage(image));
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  // In handleDelete function
  const handleDelete = () => {
    if (!imageToDelete) return;
    dispatch(deleteImageComments(imageToDelete.id)); // Add this line
    dispatch(removeImage(imageToDelete.id));
    if (selectedImage?.id === imageToDelete.id) {
      const nextImage = images.find((img) => img.id !== imageToDelete.id);
      if (nextImage) {
        dispatch(selectImage(nextImage));
      }
    }
    setDeleteDialogOpen(false);
    setImageToDelete(null);
  };

  return (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}
    >
      <Typography variant="h6" gutterBottom>
        Gallery
      </Typography>

      <List sx={{ flexGrow: 1, overflow: "auto" }}>
        {images.map((image) => {
          const commentCount = getCommentCount(image.id);
          return (
            <ListItem
              key={image.id}
              disablePadding
              sx={{
                position: "relative",
                "&:hover .delete-button": {
                  opacity: 1,
                },
              }}
            >
              <ListItemButton
                selected={selectedImage?.id === image.id}
                onClick={() => handleImageSelect(image)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  "&.Mui-selected": {
                    backgroundColor: "action.selected",
                  },
                }}
              >
                <Badge
                  badgeContent={commentCount}
                  color="primary"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  sx={{
                    "& .MuiBadge-badge": {
                      right: 5,
                      top: 5,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={image.url}
                    alt={image.name}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                </Badge>
                <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                  <Typography noWrap>{image.name}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block" }}
                  >
                    {new Date(image.timestamp).toLocaleDateString()}
                  </Typography>
                </Box>
              </ListItemButton>

              <IconButton
                className="delete-button"
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  opacity: 0,
                  transition: "all 0.2s",
                  "&:hover": {
                    color: "error.main",
                    bgcolor: "error.light",
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageToDelete(image);
                  setDeleteDialogOpen(true);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          );
        })}
      </List>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        image={imageToDelete}
        onConfirm={handleDelete}
        onClose={() => {
          setDeleteDialogOpen(false);
          setImageToDelete(null);
        }}
      />
    </Box>
  );
}
