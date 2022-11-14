import React, { useState } from 'react';
import useStyle from './styles';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deletePost, likePost } from '../../../actions/posts';
import { Link, useHistory } from 'react-router-dom';

export const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();
  const classes = useStyle();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem('profile'));
  const googleId = user?.result?.sub;

  const openPost = () => history.push(`/posts/${post._id}`);
  const [likes, setLikes] = useState(post?.likes);

  const userId = user?.result?.googleId || user?.result?._id;
  const hasLikePost = post.likes.find((like) => like === userId);

  const handleLike = async () => {
    dispatch(likePost(post._id));

    if(hasLikePost) {
      setLikes(post.likes.filter((id) => id !== userId));
    } else {
      setLikes([...post.likes, userId]);
    }
  };

  const Likes = () => {
    
    if(likes.length > 0) {
      //console.log(user?.result?.googleId);
      return likes.find((like) => like === userId)
      ? (
        <><ThumbUpAltIcon fontSize='small' />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
      ) : (
        <><ThumbUpAltIcon fontSize='small' />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
      );
    }
    return <><ThumbUpAltIcon fontSize='small' />&nbsp;Like</>;
  };
  
  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase className={classes.cardActioin} onClick={openPost}>
        <div>
          <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
          <div className={classes.overlay}>
              <Typography variant='h6'>{post.name}</Typography>
              <Typography variant='body2'>{moment(post.createdAt).fromNow()}</Typography>
          </div>
          
    {/* Button div */}
    {(googleId === post?.creator || user?.result?._id === post?.creator) && (
          <div className={classes.overlay2}>
            <Button 
                style={{color: 'white'}} 
                size="small" 
                onClick={() => setCurrentId(post._id)}>
                <MoreHorizIcon fontSize='default' />
            </Button>
          </div>
    )}
          {/* Details div */}
          <div className={classes.details}>
          <Typography variant='body2' color="textSecondary">{post.tags.map((tag) => `#${tag} `)}</Typography>
          </div>
          <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
          {/* Card Content */}
          <CardContent>
          <Typography variant="body2" color='textSecondary' className={classes.message} component="p">{post.message.substring(0, 300)}</Typography>
          </CardContent>
          </div>
      </ButtonBase>
      {/* Actions */}
      <CardActions className={classes.cardActions}>
          <Button size='small' color="primary" disabled={!user?.result} onClick={handleLike}>
            <Likes />
          </Button>
          {(googleId === post?.creator || user?.result?._id === post?.creator) && (
            <Button size='small' color="primary" onClick={() => dispatch(deletePost(post._id))}>
            <DeleteIcon fontSize='small' />
            Delete
          </Button>
          )}   
      </CardActions>
      
    </Card>
  )
}
