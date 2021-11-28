 /* eslint-disable */
import React, { useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { createCategory, editCategory, updateProfile } from '../../api';
import { useSnackbar } from 'react-simple-snackbar'
import {toast} from 'react-toastify'

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: '#1976D2',
    marginLeft: 0,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: 'white',
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const AddCategory = ({ setOpen, open, edit, setEdit}) => {
    //const location = useLocation()
    const [employeeData, setEmployeeData] = useState({ name: '', email: '', phoneNumber: '', businessName: '', contactAddress: ''})
    // eslint-disable-next-line 
    useEffect(() => {
      if(edit?._id !== '') {
        setEmployeeData({...edit})
      }
    }, [edit])

    console.log(employeeData);


    const handleSubmitCate = async (e)=> {
        e.preventDefault()
        if(employeeData?.categoryName === '') {
          toast.error("Please fill the cateogry name")
          return;
        }
        if(employeeData?._id) {
          const response = await updateProfile(employeeData._id,employeeData)
          if(response?.data?.status === 400) {
            toast.error(response?.data?.message);
            return;
          }
          else {
            clear();
            handleClose();
            window.location.href = "/employee"
            toast.success("Employee Updated");
          }
        } else {
          const response = await createCategory(employeeData)
          if(response?.data?.status === 400) {
            toast.error(response?.data?.message);
            return;
          }
          else {
            handleClose();
            window.location.href = "/employee"
            toast.success("Employee Created");
          }
        }
        
    }

  const clear =() => {
    setEdit({}) 
    setEmployeeData({ categoryName: '' })
  }
    
  const handleClose = () => {
    setOpen(false);
  };

  const inputStyle = {
    display: "block",
    padding: "1.4rem 0.75rem",
    width: "100%",
    fontSize: "0.8rem",
    lineHeight: 1.25,
    color: "#55595c",
    backgroundColor: "#fff",
    backgroundImage: "none",
    backgroundClip: "padding-box",
    borderTop: "0",
    borderRight: "0",
    borderBottom: "1px solid #eee",
    borderLeft: "0",
    borderRadius: "3px",
    transition: "all 0.25s cubic-bezier(0.4, 0, 1, 1)"
}


  return (
    <div>
        <form >
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth>
            <DialogTitle id="customized-dialog-title" onClose={handleClose} style={{paddingLeft: '20px', color: 'white'}}>
            {employeeData?._id ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
            <DialogContent dividers>


            <div className="customInputs">
              <input 
                placeholder="Full Name" 
                style={inputStyle} 
                name='name' 
                type='text'  
                onChange={(e) => setEmployeeData({...employeeData, [e.target.name]: e.target.value})}
                value={employeeData.name} 
              />
              <input 
                placeholder="Email" 
                style={inputStyle} 
                name='email' 
                type='text'  
                onChange={(e) => setEmployeeData({...employeeData, [e.target.name]: e.target.value})}
                value={employeeData.email} 
              />
              <input 
                placeholder="Phone Number" 
                style={inputStyle} 
                name='phoneNumber' 
                type='text'  
                onChange={(e) => setEmployeeData({...employeeData, [e.target.name]: e.target.value})}
                value={employeeData.phoneNumber} 
              />
              <input 
                placeholder="Business Name" 
                style={inputStyle} 
                name='businessName' 
                type='text'  
                onChange={(e) => setEmployeeData({...employeeData, [e.target.name]: e.target.value})}
                value={employeeData.businessName} 
              />
               <input 
                placeholder="Address" 
                style={inputStyle} 
                name='contactAddress' 
                type='text'  
                onChange={(e) => setEmployeeData({...employeeData, [e.target.name]: e.target.value})}
                value={employeeData.contactAddress} 
              />

          </div>

            </DialogContent>
            <DialogActions>
            <Button  onClick={handleSubmitCate}  variant="contained" style={{marginRight: '25px'}} >
                Save Profile
            </Button>
            </DialogActions>
      </Dialog>
        </form>
    </div>
  );
}

export default AddCategory