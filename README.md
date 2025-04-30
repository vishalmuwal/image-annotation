# Image Annotation Tool

A React-based image annotation tool that allows users to add, manage, and organize comments on images, similar to Figma's commenting system.

## Features

### Image Management

- Upload multiple images (JPEG, PNG)
- Responsive image display
- Gallery view for easy image switching
- Drag and drop support for image uploads

### Annotation System

- Click anywhere on images to add comments
- Numbered markers show comment locations
- Comments appear in exact clicked positions
- Smart positioning of comment popups to prevent overflow

### Comment System

- Threaded comments with nested replies
- Edit and delete functionality for comments
- Real-time comment updates
- Comment count badges in gallery view

### User Interface

- Clean, modern Material-UI design
- Sidebar with comment list and quick navigation
- Smooth animations and transitions
- Responsive layout that works on different screen sizes

### Performance Features

- Redux for efficient state management
- Local storage persistence
- Debounced input fields for better performance
- Optimized rendering for multiple comments

## Technical Implementation

- **Frontend**: React.js with Material-UI
- **State Management**: Redux with Redux Toolkit
- **Storage**: LocalStorage for data persistence
- **Performance**: Input debouncing, optimized renders

## Key Components

- `ImageViewer`: Main image display with annotation functionality
- `ImageGallery`: Thumbnail view of uploaded images
- `CommentDialog`: Threaded comment interface
- `CommentPanel`: Sidebar listing all comments

## State Management

- Normalized comment storage
- Efficient marker tracking
- Optimized image state management
- Persistent storage handling

## Usage

1. Upload images using the upload button or drag and drop
2. Click the "Add Comment" button to enter annotation mode
3. Click anywhere on the image to add a comment
4. View and manage comments in the sidebar
5. Click on markers to view and reply to comments

## GitHub Repository

- https://github.com/vishalmuwal/image-annotation

## Vercel Deployment Link

- https://image-annotation-mu.vercel.app/
