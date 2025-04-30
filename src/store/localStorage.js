export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("imageAnnotationState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      images: state.images,
      comments: state.comments,
    });
    localStorage.setItem("imageAnnotationState", serializedState);
  } catch (err) {
    console.log(err);
  }
};
