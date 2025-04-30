import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { CloudUpload, Delete as DeleteIcon } from "@mui/icons-material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CancelIcon from "@mui/icons-material/Cancel";
import { addImage, selectImage, removeImage } from "../store/slices/imageSlice";
import { addComment, deleteImageComments } from "../store/slices/commentSlice";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { CommentDialog } from "./CommentDialog";

export function ImageViewer() {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const selectedImage = useSelector((state) => state.images.selectedImage);
  const markers = useSelector((state) => state.comments.markers);
  const images = useSelector((state) => state.images.list);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [clickPosition, setClickPosition] = useState(null);
  const activeComment = useSelector((state) => {
    const markerId = activeMarker?.id;
    return markerId ? state.comments.byId[markerId] : null;
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now().toString(),
          name: file.name,
          url: e.target.result,
          timestamp: new Date().toISOString(),
        };
        dispatch(addImage(newImage));
        dispatch(selectImage(newImage));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (e) => {
    if (!selectedImage || !isAddingComment) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const commentId = Date.now().toString();
    dispatch(
      addComment({
        id: commentId,
        content: "",
        imageId: selectedImage.id,
        marker: { id: commentId, x, y, imageId: selectedImage.id },
        author: "User",
        timestamp: new Date().toISOString(),
      })
    );
    setActiveMarker({ id: commentId, x, y });
    setClickPosition({ x, y });
    setDialogOpen(true);
    setIsAddingComment(false);
  };

  const handleMarkerClick = (marker, e) => {
    e.stopPropagation();
    setActiveMarker(marker);
    setClickPosition({ x: marker.x, y: marker.y });
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (!selectedImage) return;
    dispatch(deleteImageComments(selectedImage.id));
    dispatch(removeImage(selectedImage.id));
    const nextImage = images.find((img) => img.id !== selectedImage.id);
    if (nextImage) {
      dispatch(selectImage(nextImage));
    }
    setDeleteDialogOpen(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now().toString(),
          name: file.name,
          url: e.target.result,
          timestamp: new Date().toISOString(),
        };
        dispatch(addImage(newImage));
        dispatch(selectImage(newImage));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    // Delay clearing the marker and position until after the dialog animation
    setTimeout(() => {
      setActiveMarker(null);
      setClickPosition(null);
    }, 300);
  };

  return (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}
    >
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUpload />}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileSelect}
          />
        </Button>
        {selectedImage && (
          <Button
            variant={isAddingComment ? "contained" : "outlined"}
            color={isAddingComment ? "secondary" : "primary"}
            startIcon={isAddingComment ? <CancelIcon /> : <AddCommentIcon />}
            onClick={() => setIsAddingComment(!isAddingComment)}
          >
            {isAddingComment ? "Cancel" : "Add Comment"}
          </Button>
        )}
      </Stack>

      {selectedImage ? (
        <Paper
          elevation={2}
          onClick={handleImageClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{
            position: "relative",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isAddingComment ? "crosshair" : "default",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={selectedImage.url}
            alt={selectedImage.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {markers
            .filter((marker) => marker.imageId === selectedImage.id)
            .map((marker, index) => (
              <Box
                key={marker.id}
                sx={{
                  position: "absolute",
                  left: `${marker.x}%`,
                  top: `${marker.y}%`,
                  width: 24,
                  height: 24,
                  bgcolor: "primary.main",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
                onClick={(e) => handleMarkerClick(marker, e)}
              >
                {index + 1}
              </Box>
            ))}

          <IconButton
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                color: "error.main",
                bgcolor: "error.light",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialogOpen(true);
            }}
          >
            <DeleteIcon />
          </IconButton>

          <CommentDialog
            open={dialogOpen}
            comment={activeComment || {}}
            onClose={handleDialogClose}
            position={clickPosition}
          />
        </Paper>
      ) : (
        <Paper
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey.100",
            border: "2px dashed",
            borderColor: "grey.300",
          }}
        >
          <Typography color="text.secondary">
            Drop an image here or select from gallery
          </Typography>
        </Paper>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        image={selectedImage}
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
}
