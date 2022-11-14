import React, { useEffect } from 'react';
import moment from 'moment'; // js library that deals with time
import { Paper, Typography, CircularProgress, Divider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import useStyles from './styles';
import { getPost, getPostsBySearch } from '../../actions/posts';
import CommentSection from './CommentSection';


export const PostDetails = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts); // state.posts is reducer
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams(); // dispatch the id of the post

  // dispatch an action
  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  // for recommended post
  useEffect(() => {
    if(post) {
      dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',')}));
    }

  }, [post]);

  // check if the post is loading
  if(!post) return null;
  if(isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(({ _id}) => _id !== post._id);
  const openPost = (_id) => history.push(`/posts/${_id}`);
    
  return (
      <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography>
          <Divider style={{ margin: '20px 0' }} />
          <CommentSection post={post} />
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className={classes.imageSection}>
          <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
        </div>
      </div>
       {/* RECOMMENDED POST */}
       {recommendedPosts.length && (
        <div className={classes.sectioin}>
{/* gutterBottom - gives margin at the bottom */}
            <Typography gutterBottom variant='h5'>You might also like:</Typography>
            <Divider />
            <div className={classes.recommendedPosts}>
              {recommendedPosts.map(({ title, message, name, likes, selectedFile, _id }) => (
                <div style={{ margin: '20px', cursor: "pointer"}} onClick={() => openPost(_id)} key={_id}>
                  <Typography gutterBottom variant="h6">{title}</Typography>
                  <Typography gutterBottom variant="subtitle2"><strong>{name}</strong></Typography>
                  <Typography gutterBottom variant="subtitle2">{message}</Typography>
                  <Typography gutterBottom variant="subtitle1">{title}</Typography>
                  <Typography gutterBottom variant="h6">Likes: {likes.length}</Typography>
                  <img src={selectedFile} alt={title} width="200px" />
                </div>
              ))}
            </div>
        </div>
      )}
      </Paper>
  );
};
