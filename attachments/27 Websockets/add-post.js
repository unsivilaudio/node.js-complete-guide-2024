this.setState(prevState => {
  const updatedPosts = [...prevState.posts];
  if (prevState.postPage === 1) {
    if (prevState.posts.length >= 2) {
      updatedPosts.pop();
    }
    updatedPosts.unshift(post);
  }
  return {
    posts: updatedPosts,
    totalPosts: prevState.totalPosts + 1
  };
});
