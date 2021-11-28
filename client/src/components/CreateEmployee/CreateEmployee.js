import React, { useState } from 'react'
import Field from './Field'
import useStyles from './styles'
import styles from './Login.module.css'
import {toast} from 'react-toastify'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
// import Google from './Google'
import ProgressButton from 'react-progress-button'
import { signUp, createProfile } from '../../api'


const initialState ={ firstName: '', lastName: '', email: '', password: '', confirmPassword: ''}

const CreateEmployee = () => {

    const classes = useStyles();
    const [formData, setFormData] = useState(initialState)
    const [showPassword, setShowPassword] = useState(false);
     // eslint-disable-next-line 

    const handleShowPassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault()
        for (const [key, value] of Object.entries(formData)) {
          console.log(`${key}: ${value}`);
          if (value === "") {
            toast.error(`${key} is required!`);
            return;
          }
        }
        if(formData.password !== formData.confirmPassword) {
          toast.error("Password must be matched")
          return;
        }
        const { data, status } = await signUp(formData)
        if(status === 400) {
          toast.error("Account already existed")
          return;
        } 
        if(status === 201) {
          const { info, status } = await createProfile({name: data?.result?.name, email: data?.result?.email, userId: data?.result?._id, phoneNumber: '', businessName: '', contactAddress: '', logo: '', website: ''});
          if(status === 201) {
            setFormData(initialState)
            toast.success("Account Created");
          }
        }
    }
    const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value})
    }


    return (
        <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={2}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Create Employee</Typography>
        <form className={classes.form}>
          <Grid container spacing={2}>
            <>
              <Field name="firstName" label="First Name" value={formData.firstName} handleChange={handleChange} autoFocus half />
              <Field name="lastName" label="Last Name" value={formData.lastName} handleChange={handleChange} half />
            </>
            <Field name="email" label="Email Address" value={formData.email} handleChange={handleChange} type="email" />
            <Field name="password" label="Password" value={formData.password} handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            <Field name="confirmPassword" label="Password" value={formData.confirmPassword} handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
          </Grid>
          <div className={styles.buttons}>
               <div>
                    {/* <button className={styles.submitBtn}> { isSignup ? 'Sign Up' : 'Sign In' }</button> */}
                    <Button onClick={handleSubmit} style={{border: 1, background: '#03adfc', borderRadius: 5, color: "#fff"}}>Create Employee</Button>
                </div>
          </div>
        </form>
      </Paper>
    </Container>
    )
}

export default CreateEmployee
