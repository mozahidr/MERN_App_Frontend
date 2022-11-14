import React, { useState, useEffect } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import useStyles from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Input } from './Input';
import Icon from './icon';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import { signin, signup } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

export const Auth = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);  // New State For Password show
  const [isSignup, setIsSignup] = useState(false);
  const [ formData, setFormData ] = useState(initialState);


  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
   
      if(isSignup) {
        dispatch(signup(formData, history));
      } else {
        dispatch(signin(formData, history));
      }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };
  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
};

const googleSuccess = async (res) => {
  console.log(res);
  const decode = jwt_decode(res.credential);
  console.log(decode);
  

  const {name, picture, sub, email } = decode;
  const user = {
    id: sub,
    type: 'user',
    userName: name,
    image: picture,
    email: email
  }
  console.log(user);
  //const result = res?.profileObj;
  const result = jwt_decode(res.credential);
  //const token = result?.sub;
  const token = res.credential;
  
  try {
    dispatch({ type: 'AUTH', data: {result, token} });
    history.push('/');
  } catch (error) {
    console.log(error);
  }
};
const googleFailure = (error) => {
  console.log(error);
  console.log("Google Sign In was unsuccessful. Try again later");
}
  return (
    <GoogleOAuthProvider clientId='776239060026-nls8vdhn28iblqpvgssus71ram7pqqnj.apps.googleusercontent.com'>
      <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
        {/* Form */}
        <Typography variant="h5">{isSignup ? 'Sign up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {
              isSignup && (
                <>
                  <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                  <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                </>
              )}
              <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
              <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
              { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
          </Grid>
          
          <Button type='submit' fullWidth variant='contained' color="primary" className={classes.submit}>
            { isSignup ? 'Sign Up' : 'Sign In'}
          </Button>

          {/* <GoogleOAuthProvider 
            clientId='776239060026-nls8vdhn28iblqpvgssus71ram7pqqnj.apps.googleusercontent.com'
            render={(renderProps) => (
              <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                  Google Sign In
                </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          /> */}
          <GoogleLogin 
            onSuccess={(res) => googleSuccess(res)}
            onError={() => console.log('Error')}
          />
          {/* Switch Mode */}
                <Grid container justify="flex-end">
                  <Grid item>
                    <Button onClick={switchMode}>
                      { isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sing Up"}
                    </Button>
                  </Grid>
                </Grid>
        </form>

      </Paper>
    </Container>
    </GoogleOAuthProvider>
  )
}
