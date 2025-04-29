import { useSelector } from "react-redux";
import { useState } from "react";
import { Box, Typography, Paper, Stack, Divider } from "@mui/material";
import { CommentDialog } from "./CommentDialog";

export function CommentPanel() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const selectedImage = useSelector((state) => state.images.selectedImage);
  const comments = useSelector((state) => {
    const allComments = state.comments.byId;
    return Object.values(allComments)
      .filter((comment) => comment.imageId === selectedImage?.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  });

  return (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}
    >
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>

      <Stack spacing={2} sx={{ flex: 1, overflow: "auto" }}>
        {comments.map((comment) => (
          <Paper
            key={comment.id}
            sx={{ p: 2, cursor: "pointer" }}
            onClick={() => {
              setSelectedComment(comment);
              setDialogOpen(true);
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Marker {comment.markerNumber}
            </Typography>
            <Typography>{comment.content}</Typography>
            {comment.replies?.length > 0 && (
              <Box sx={{ mt: 1, color: "text.secondary" }}>
                {comment.replies.length}{" "}
                {comment.replies.length === 1 ? "reply" : "replies"}
              </Box>
            )}
          </Paper>
        ))}
      </Stack>

      <CommentDialog
        open={dialogOpen}
        comment={selectedComment || {}}
        onClose={() => {
          setDialogOpen(false);
          setSelectedComment(null);
        }}
        position={null}
      />
    </Box>
  );
}
