import React, { useState } from 'react'
import Field from './Field'
import useStyles from './styles'
import styles from './Login.module.css'
import { GoogleLogin } from 'react-google-login'
import {useDispatch} from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { signup, signin } from '../../actions/auth'
import { Avatar, Button, Paper, Grid, Typography, Container} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { createProfile } from '../../actions/profile'
// import Google from './Google'
import { useSnackbar } from 'react-simple-snackbar'
import ProgressButton from 'react-progress-button'



const initialState ={ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', profilePicture: '', bio: ''}

const Login = () => {

    const classes = useStyles();
    const [formData, setFormData] = useState(initialState)
    const [isSignup, setIsSignup] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const [showPassword, setShowPassword] = useState(false);
     // eslint-disable-next-line 
    const [openSnackbar, closeSnackbar] = useSnackbar()
    const user = JSON.parse(localStorage.getItem('profile'))
    
    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleChange =(e)=> {
        setFormData( {...formData, [e.target.name] : e.target.value} )
    }

    const handleSubmit =(e) => {
        e.preventDefault()
        if(isSignup) {
            dispatch(signup(formData, openSnackbar))
        } else {
            dispatch(signin(formData, openSnackbar))
        }
    }


    const switchMode =() => {
        setIsSignup((prevState) => !prevState)
    }

    const googleSuccess = async (res) => {
        console.log(res)
        const result = res?.profileObj
        const token = res?.tokenId
        dispatch(createProfile({name: result?.name, email: result?.email, userId: result?.googleId, phoneNumber: '', businessName: '', contactAddress: '', logo: result?.imageUrl, website: ''}))

        try {
            dispatch({ type: "AUTH", data: {result, token}})

            window.location.href='/dashboard'
            
        } catch (error) {
            console.log(error)
        }
    }
    const googleError =(error) => {
        console.log(error)
        console.log("Google Sign In was unseccassful. Try again later")
    }


    if(user) {
      history.push('/dashboard')
    }

    return (
        <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={2}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{ isSignup ? 'Sign up' : 'Sign in' }</Typography>
        <form className={classes.form}>
          <Grid container spacing={2}>
            { isSignup && (
            <>
              <Field name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
              <Field name="lastName" label="Last Name" handleChange={handleChange} half />
            </>
            )}
            <Field name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Field name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
          </Grid>
          <div className={styles.buttons}>
               <div>
                    {/* <button className={styles.submitBtn}> { isSignup ? 'Sign Up' : 'Sign In' }</button> */}
                    <Button variant="outlined" onClick={handleSubmit}>Sign In</Button>
                </div>
          </div>
        </form>
      </Paper>
    </Container>
    )
}

export default Login
