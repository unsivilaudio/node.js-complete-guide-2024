this.setState(prevState => {
  let updatedPosts = [...prevState.posts];
  if (prevState.editPost) {
    const postIndex = prevState.posts.findIndex(
      p => p._id === prevState.editPost._id
    );
    updatedPosts[postIndex] = post;
  } else {
    updatedPosts.unshift(post);
  }
  return {
    posts: updatedPosts,
    isEditing: false,
    editPost: null,
    editLoading: false
  };
});
