this.setState(prevState => {
  const updatedPosts = [...prevState.posts];
  const updatedPostIndex = updatedPosts.findIndex(p => p._id === post._id);
  if (updatedPostIndex > -1) {
    updatedPosts[updatedPostIndex] = post;
  }
  return {
    posts: updatedPosts
  };
});
